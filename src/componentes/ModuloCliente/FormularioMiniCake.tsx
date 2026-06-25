import { useEffect, useMemo, useState } from "react";
import { useCartFunctions } from "../../hooks/useCartFunctions";
import useUserSession from "../../hooks/useUserSession";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import type { CarritoItem, PropsFormularioMiniCake, UID } from "../../assets/types-interfaces/types";
import { useCart } from "../Navegacion/useCart";
import { comprimirImagen, eliminarImagenReferenciaSupabase, importarImagenReferenciaPorRuta, subirImagenReferenciaSupabase } from "../../hooks/useUploadImageSupabase";



export const FormularioMiniCake = ({ id, nombre, sabor_producto, tipo_formulario, imagenes_producto }: PropsFormularioMiniCake) => {

    const sesion = useUserSession();
    const { agregarProductoCarrito, actualizarProductoCarrito } = useCartFunctions();
    const { agregarItem, actualizarItem } = useCart();
    const redirigir = useNavigate();
    const { search, state } = useLocation();

    const editarItem = new URLSearchParams(search).get("editar");
    const atributosAcambiar = state?.atributosAcambiar as CarritoItem | undefined;

    // Lógica de visibilidad de campos extra
    const esCrea = nombre.toLocaleLowerCase().includes('crea');
    const esMiniCake = nombre.toLocaleLowerCase().includes('minicake');
    const mostrarCamposExtra = esCrea || esMiniCake;
    const camposExtraRequeridos = esCrea;

    const [uid, setUid] = useState<UID>(`${""}-${""}-${""}-${""}-${""}`);
    const [sabor_id, setSabor_id] = useState<number | undefined>(sabor_producto[0]?.sabores.sabor_id ?? 1);
    const [saborNombre, setSaborNombre] = useState<string | undefined>(sabor_producto[0]?.sabores.nombre ?? "Chocolate");
    const [vistaPreviaImagen, setVistaPreviaImagen] = useState<string | null>(null);
    const [imagenReferencia, setImagenReferencia] = useState<File | null>(null);
    const [detalleMiniCake, setDetalleMiniCake] = useState<string>('');
    const [rutaImagenReferencia, setRutaImagenReferencia] = useState<string | undefined>('');
    const [esconder, setEsconder] = useState<boolean>(false);

    useEffect(() => {
        if (!atributosAcambiar) return;

        setUid(atributosAcambiar.uid);
        setSabor_id(atributosAcambiar.sabor_id);
        setSaborNombre(atributosAcambiar.sabor_nombre);
        setRutaImagenReferencia(atributosAcambiar.ruta_imagen_referencia);
        setDetalleMiniCake(atributosAcambiar.detalle ?? '');
        setImagenReferencia(null);
        setVistaPreviaImagen(null);
    }, [atributosAcambiar]);

    const isFormComplete = useMemo(() => {
        const tieneSabor = Number.isFinite(sabor_id) && sabor_id! > 0;
        const cumpleCamposExtra = !camposExtraRequeridos || (
            detalleMiniCake.trim().length > 0 &&
            (!!imagenReferencia || !!rutaImagenReferencia)
        );
        return tieneSabor && cumpleCamposExtra;
    }, [sabor_id, camposExtraRequeridos, detalleMiniCake, imagenReferencia, rutaImagenReferencia]);

    const CapturarSaborIDyNombre = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const idSabor = Number(e.currentTarget.value);
        const obj = sabor_producto.find((sabor) => sabor.sabor_id == idSabor);
        setSabor_id(idSabor);
        setSaborNombre(obj!.sabores.nombre);
    };

    const validarImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const archivo = e.target.files?.[0];
        if (!archivo) return;

        const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
        if (!tiposPermitidos.includes(archivo.type)) {
            toast.error('Tipo de imagen no permitida');
            e.target.value = '';
            return;
        }
        if (archivo.size > 5 * 1024 * 1024) {
            toast.error('El tamaño de imagen supera los 5MB');
            e.target.value = '';
            return;
        }

        const archivoComprimido = await comprimirImagen(archivo);
        setImagenReferencia(archivoComprimido);
        setVistaPreviaImagen(URL.createObjectURL(archivoComprimido));
    };

    const enviarFormulario = async (e: React.FormEvent) => {
        e.preventDefault();
        let rutaArchivo: string | undefined = undefined;

        if (!isFormComplete) {
            toast.clearWaitingQueue();
            toast.warning("Completa todos los campos para continuar.");
            return;
        }

        setEsconder(true);
        if (esconder) return;

        const imagenURL = imagenes_producto?.[0]?.url ?? "";

        if (editarItem) {
            if (imagenReferencia) {
                await eliminarImagenReferenciaSupabase(uid, tipo_formulario);
                rutaArchivo = await subirImagenReferenciaSupabase(imagenReferencia, sesion?.user.id, tipo_formulario);
            }

            const item = {
                uid,
                user_id: sesion?.user.id,
                nombre_producto: nombre,
                sabor_id,
                sabor_nombre: saborNombre,
                ruta_imagen_referencia: rutaArchivo,
                detalle: detalleMiniCake,
                imagen_url: imagenURL,
                producto_id: id,
                tipo_formulario,
            };

            await actualizarProductoCarrito(item);
            actualizarItem(item);
            toast.clearWaitingQueue();
            toast.info("¡Producto actualizado con éxito!");
            setImagenReferencia(null);
            redirigir("/carrito");

        } else {
            if (imagenReferencia) {
                rutaArchivo = await subirImagenReferenciaSupabase(imagenReferencia, sesion?.user.id, tipo_formulario);
            }

            const nuevoUid = crypto.randomUUID?.();
            const item = {
                uid: nuevoUid,
                user_id: sesion?.user.id,
                nombre_producto: nombre,
                tamano: 10,
                tamano_id: 1,
                sabor_id,
                sabor_nombre: saborNombre,
                ruta_imagen_referencia: rutaArchivo,
                detalle: detalleMiniCake,
                imagen_url: imagenURL,
                producto_id: id,
                tipo_formulario,
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Personaliza tu MiniCake</h2>

            {/* Campo sabor */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Sabor</label>
                <select
                    value={sabor_id}
                    onChange={CapturarSaborIDyNombre}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[#f57fa6] focus:border-transparent transition-all outline-none"
                >
                    {sabor_producto.map((item, index) => (
                        <option key={index} value={item.sabor_id}>
                            {item.sabores.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {/* Campos extra: imagen de referencia y detalle (si el nombre incluye 'crea' o 'minicake') */}
            {mostrarCamposExtra && (
                <>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Imagen de referencia
                            {!camposExtraRequeridos && <span className="text-gray-400 text-xs ml-2">(opcional)</span>}
                        </label>
                        <input
                            type="file"
                            accept=".jpg,.png,.jpeg"
                            onChange={validarImagen}
                            required={camposExtraRequeridos && !editarItem}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[#f57fa6] focus:border-transparent transition-all outline-none"
                        />
                    </div>

                    {vistaPreviaImagen ? (
                        <img src={vistaPreviaImagen} alt="Preview imagen seleccionada" style={{ maxWidth: 200 }} />
                    ) : rutaImagenReferencia ? (
                        <img src={importarImagenReferenciaPorRuta(rutaImagenReferencia, tipo_formulario)} alt="Imagen de referencia guardada" style={{ maxWidth: 200 }} />
                    ) : null}

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Detalle mini cake
                            <span className="text-gray-500 text-xs ml-2">{detalleMiniCake.length}/300 caracteres</span>
                            {!camposExtraRequeridos && <span className="text-gray-400 text-xs ml-1">(opcional)</span>}
                        </label>
                        <textarea
                            value={detalleMiniCake}
                            onChange={(e) => setDetalleMiniCake(e.target.value)}
                            placeholder="Ej: Sin nueces por alergia, decoración con flores rosadas, mensaje personalizado..."
                            rows={4}
                            maxLength={300}
                            required={camposExtraRequeridos}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[#f57fa6] focus:border-transparent transition-all outline-none resize-none"
                        />
                        <p className="text-xs text-gray-500">Especifica alergias, instrucciones de decoración o mensajes personalizados</p>
                    </div>
                </>
            )}

            {/* Botón agregar / actualizar */}
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