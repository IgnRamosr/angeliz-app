    import { useEffect, useMemo, useState } from "react";
    import { useCartFunctions } from "../../hooks/useCartFunctions";
    import useUserSession from "../../hooks/useUserSession";
    import { useNavigate, useLocation } from "react-router-dom";
    import { toast } from "react-toastify";
    import type { CarritoItem, PropsFormularioGalletas, UID } from "../../assets/types-interfaces/types";
    import { useCart } from "../Navegacion/useCart";
    import FechaEntregaPicker from "./FechaEntregaPicker";
    import { toLocalISODate } from "../../utils/fechas";
    import { comprimirImagen, eliminarImagenReferenciaSupabase, importarImagenReferenciaPorRuta, subirImagenReferenciaSupabase } from "../../hooks/useUploadImageSupabase";

    export const FormularioGalletas = ({id, nombre, tipo_formulario, imagenes_producto}: PropsFormularioGalletas) => {

    const sesion = useUserSession();

    const { agregarProductoCarrito, actualizarProductoCarrito } = useCartFunctions();
    const { agregarItem, actualizarItem } = useCart();

    const redirigir = useNavigate();

    const { search, state } = useLocation();

    const editarItem = new URLSearchParams(search).get("editar");
    const atributosAcambiar = state?.atributosAcambiar as CarritoItem | undefined;

    const [uid, setUid] = useState<UID>(`${""}-${""}-${""}-${""}-${""}`);
    const [cantidad, setCantidad] = useState<number | undefined>(1);
    const [fechaEntrega, setFechaEntrega] = useState<Date | null>(null);
    const [vistaPreviaImagen, setVistaPreviaImagen] = useState<string | null>(null);
    const [imagenReferencia, setImagenReferencia] = useState<File | null>();
    const [detalleGalletas, setDetalleGalletas] = useState<string | undefined>('');
    const [rutaImagenReferencia, setRutaImagenReferencia] = useState<string | undefined>('');
    const [metodoEnvio, setMetodoEnvio] = useState<string>("Retiro en domicilio");

    const [esconder, setEsconder] = useState<boolean>(false);

    useEffect(() => {


        //Agregar campo galletas, verificar función de actualizar
        if (!atributosAcambiar) return;
        setUid(atributosAcambiar.uid);
        setFechaEntrega(new Date(atributosAcambiar.fecha_entrega));
        setRutaImagenReferencia(atributosAcambiar.ruta_imagen_referencia);
        setDetalleGalletas(atributosAcambiar.detalle);
        setMetodoEnvio(atributosAcambiar.metodo_envio);
        setCantidad(atributosAcambiar.cantidad);
        setImagenReferencia(null);
        setVistaPreviaImagen(null);

    }, [atributosAcambiar]);

    {/* Función para validar si el formulario está completo */}
    const isFormComplete = useMemo(() => {
        const tieneCantidad = cantidad! > 0;
        const tieneFecha = fechaEntrega instanceof Date && !isNaN(fechaEntrega.getTime());
        const tieneMetodo = typeof metodoEnvio === "string" && metodoEnvio.trim().length > 0;
        return tieneCantidad && tieneFecha && tieneMetodo;
    }, [cantidad, fechaEntrega, metodoEnvio]);


    const validarImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const validarTipoYtamaño = (archivo: File) =>{

            const tiposImagenPermitidas = ['image/jpeg', 'image/png', 'image/webp'];
            if(!tiposImagenPermitidas.includes(archivo.type)){
                return toast.error('Tipo de imagen no permitida');
            }

            const tamañoMaximoImagen = 5;
            if (archivo.size > tamañoMaximoImagen * 1024 * 1024){
                return toast.error('El tamaño de imagen supera a los 2MB');
            }

            return null;
        }

        const archivo = e.target.files?.[0];

        if(!archivo) return;

        const error = validarTipoYtamaño(archivo);

        if(error){
            toast.error(error);
            e.target.value = '';
            return;
        }

        const archivoComprimido = await comprimirImagen(archivo);


        setImagenReferencia(archivoComprimido);

        const vistaPreviaURL = URL.createObjectURL(archivoComprimido);
        setVistaPreviaImagen(vistaPreviaURL);

    };

    const enviarFormulario = async (e: React.FormEvent) => {
        e.preventDefault();
        let rutaArchivo: string | undefined = undefined;

        //Validación si el formulario no está completo
        if (!isFormComplete) {
        toast.clearWaitingQueue();
        toast.warning("Completa todos los campos para continuar.");
        return;
        }

        setEsconder(true);
        if (esconder) return;

        const imagenURL = imagenes_producto?.[0]?.url ?? "";
        const fechaStr = fechaEntrega ? toLocalISODate(fechaEntrega) : "";


        {/* Sí editamos al item se asigna los valores previamente capturados*/}

        if (editarItem) {


        await eliminarImagenReferenciaSupabase(uid, tipo_formulario);

        if (imagenReferencia){
            rutaArchivo = await subirImagenReferenciaSupabase(imagenReferencia, sesion?.user.id, tipo_formulario);
        }

        //Agregar atributo cantidad

        const item = {
            uid,
            user_id: sesion?.user.id,
            nombre_producto: nombre,
            fecha_entrega: fechaStr,
            ruta_imagen_referencia: rutaArchivo,
            metodo_envio: metodoEnvio,
            imagen_url: imagenURL,
            producto_id: id,
            tipo_formulario,
            cantidad: cantidad ?? 1
        };




        await actualizarProductoCarrito(item);
        actualizarItem(item);
        toast.clearWaitingQueue();
        toast.info("¡Producto actualizado con éxito!");

        setImagenReferencia(null);

        redirigir("/carrito");
        } 

        // Si no editamos, o sea agregamos se crea el campo nuevouid con crypto

        else {
        if (imagenReferencia){
            rutaArchivo = await subirImagenReferenciaSupabase(imagenReferencia, sesion?.user.id, tipo_formulario);
        }


        const nuevoUid = crypto.randomUUID?.();
        const item = {
            uid: nuevoUid,
            user_id: sesion?.user.id,
            nombre_producto: nombre,
            fecha_entrega: fechaStr,
            ruta_imagen_referencia: rutaArchivo,
            detalle: detalleGalletas,
            metodo_envio: metodoEnvio,
            imagen_url: imagenURL,
            producto_id: id,
            tipo_formulario,
            cantidad: cantidad ?? 1
        };

        await agregarProductoCarrito(item);
        agregarItem(item);

        toast.clearWaitingQueue();
        toast.success("¡Producto agregado al carrito!");

        setImagenReferencia(null);

        redirigir("/");
        }
    };


    return (
        <form
        onSubmit={enviarFormulario}
        className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6 max-w-2xl mx-auto"
        >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Personaliza tu pedido</h2>


        {/* Campo cantidad */}

        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Cantidad</label>
            <input type="number" min={1} max={99}
            value={cantidad}
            onChange={(e) => setCantidad(+e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[#f57fa6] focus:border-transparent transition-all outline-none resize-none" />
        </div>


        {/* Campo fecha entrega */}

        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Fecha de entrega</label>
            <FechaEntregaPicker value={fechaEntrega} onChange={setFechaEntrega} minDaysFromToday={1} />
        </div>



        {/* Campo imagen de referencia y vista previa de la imagen (Solo aparece si el título de galletas tiene "crea") */}

        {nombre.toLocaleLowerCase().includes('crea') && (
            <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Imagen de referencia</label>
            <input type="file"
            accept=".jpg, .png, .jepg" 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[#f57fa6] focus:border-transparent transition-all outline-none" 
            onChange={validarImagen}
            required={nombre.toLocaleLowerCase().includes('crea') && !editarItem}/> 
        </div>
        
        )}

        {vistaPreviaImagen ? (
        <img
            src={vistaPreviaImagen}
            alt="Preview imagen seleccionada"
            style={{ maxWidth: 200 }}
        />
        ) : rutaImagenReferencia ? (
        <img
            src={importarImagenReferenciaPorRuta(rutaImagenReferencia, tipo_formulario)}
            alt="Imagen de referencia guardada"
            style={{ maxWidth: 200 }}
        />
        ) : null}

        {/* Campo detalle de galletas  (Solo aparece si el título de galletas tiene "crea") */}
        {nombre.toLocaleLowerCase().includes('crea') && (

        <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
            Detalle galletas
            <span className="text-gray-500 text-xs ml-2">
            {detalleGalletas?.length}/300 caracteres
            </span>
        </label>
        <textarea
            value={detalleGalletas}
            onChange={(e) => setDetalleGalletas(e.target.value)}
            placeholder="Ej: Sin nueces por alergia, agregar mensaje 'Feliz cumpleaños María', decoración con flores rosadas..."
            rows={4}
            maxLength={300}
            required={nombre.toLocaleLowerCase().includes('crea') && !editarItem}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[#f57fa6] focus:border-transparent transition-all outline-none resize-none"
        />
        <p className="text-xs text-gray-500">
            Especifica alergias, instrucciones de decoración o mensajes personalizados
        </p>
        </div>

        )}


        {/* Campo desea agregar nombre y/o edad */}


        {/* Campo método de envío */}

        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Método de envío</label>
            <select
            value={metodoEnvio}
            onChange={(e) => setMetodoEnvio(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[#f57fa6] focus:border-transparent transition-all outline-none"
            >
            {/* Alineado con el estado inicial */}
            <option value="Retiro en domicilio">Retiro en domicilio</option>
            <option value="UberFlash">UberFlash</option>
            <option value="Metro">Metro</option>
            </select>
        </div>

        {/* Botón agregar al carrito / actualizar producto */}

        <button
            type="submit"
            disabled={esconder || !isFormComplete}
            aria-disabled={esconder || !isFormComplete}
            title={!isFormComplete ? "Completa todos los campos para continuar" : ""}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 rounded-lg hover:cursor-pointer transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg mt-2"
        >
            {esconder ? "Agregando..." : (editarItem ? "Actualizar producto" : "Agregar al carrito")}
        </button>

        </form>
    );
    };
