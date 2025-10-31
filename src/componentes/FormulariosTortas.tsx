import { useEffect, useState } from "react";
import { useCartFunctions } from "../hooks/useCartFunctions";
import useUserSession from "../hooks/useUserSession";
import { useNavigate, useLocation  } from "react-router-dom";
import { toast } from "react-toastify";
import type {CarritoItem, PropsFormularioTorta, UID} from "../assets/types-interfaces/types"
import { useCart } from "./useCart";

export const FormularioTorta = ({id,nombre, tamano_producto,sabor_producto,tipo_formulario, imagenes_producto}: PropsFormularioTorta) => {

    const sesion = useUserSession();

    const {agregarProductoCarrito, actualizarProductoCarrito} = useCartFunctions();
    const {agregarItem, actualizarItem} = useCart();

    const redirigir = useNavigate();
    const { search, state } = useLocation();

    const editarItem = new URLSearchParams(search).get("editar");
    const  atributosAcambiar = (state)?.atributosAcambiar as | CarritoItem | undefined;

    const [uid, setUid] = useState<UID>(`${""}-${""}-${""}-${""}-${""}`);
    const [tamano, setTamano] = useState<number>(tamano_producto[0]?.tamano);
    const [tamano_id, setTamano_id] = useState<number>(tamano_producto[0]?.tamano_id ?? 1);
    const [sabor_id, setSabor_id] = useState<number>(sabor_producto[0]?.sabores.sabor_id ?? 1);
    const [saborNombre, setSaborNombre] = useState<string>(sabor_producto[0]?.sabores.nombre ?? "Chocolate");
    const [fechaEntrega, setFechaEntrega] = useState<string>("");
    const [agregaNombreEdad, setagregaNombreEdad] = useState<boolean | undefined>(false);
    const [metodoEnvio, setMetodoEnvio] = useState<string>("Retiro en domicilio");

    const [esconder, setEsconder] = useState<boolean>(false)


    useEffect(() => {
        if (!atributosAcambiar) return;
        setUid(atributosAcambiar.uid);
        setTamano(atributosAcambiar.tamano);
        setTamano_id(atributosAcambiar.tamano_id);
        setSabor_id(atributosAcambiar.sabor_id);
        setSaborNombre(atributosAcambiar.sabor_nombre);
        setFechaEntrega(atributosAcambiar.fecha_entrega);
        setMetodoEnvio(atributosAcambiar.metodo_envio);
        setagregaNombreEdad(!!atributosAcambiar.agregaNombreEdad);

    }, [atributosAcambiar]);


    const enviarFormulario = async (e: React.FormEvent) => {
        e.preventDefault();

        setEsconder(true);
        if (esconder) return "Agregando producto...";


        const imagenURL = imagenes_producto![0]!.url!;

        if(editarItem){

            const item = {
            uid: uid,
            user_id: sesion?.user.id,
            nombre_producto: nombre,
            tamano,
            fecha_entrega: fechaEntrega, 
            sabor_nombre: saborNombre,
            agregaNombreEdad: agregaNombreEdad,
            metodo_envio:metodoEnvio, 
            imagen_url: imagenURL  ,
            producto_id: id,                                  
            sabor_id:sabor_id,
            tamano_id: tamano_id,
            tipo_formulario,
            }
            await actualizarProductoCarrito(item)
            actualizarItem(item);
            toast.clearWaitingQueue();
            toast.info("¡Producto actualizado con exito!");
            redirigir("/carrito");
        }
        else{
            const uid = crypto.randomUUID?.()
            const item = {
                uid: uid,
                user_id: sesion?.user.id,
                nombre_producto: nombre,
                tamano,
                fecha_entrega: fechaEntrega, 
                sabor_nombre: saborNombre,
                agregaNombreEdad,
                metodo_envio:metodoEnvio, 
                imagen_url: imagenURL  ,
                producto_id: id,                                  
                sabor_id:sabor_id,
                tamano_id: tamano_id,
                tipo_formulario: tipo_formulario
            }

            await agregarProductoCarrito(item);
            agregarItem(item);

        toast.clearWaitingQueue();
        toast.success("¡Producto agregado al carrito!");
        redirigir("/");
        }
    };

    const CapturarSaborIDyNombre = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.currentTarget.value);
    const obj = sabor_producto.find(sabor => sabor.sabor_id == id);
    setSabor_id(id);
    setSaborNombre(obj!.sabores.nombre);
    };

    const CapturarTamanoIDyNombre = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.currentTarget.value);
    const obj = tamano_producto.find(tamano => tamano.tamano_id == id);
    setTamano_id(id);
    setTamano(obj!.tamano);
    };

return (
    <form onSubmit={enviarFormulario} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Personaliza tu pedido</h2>
        
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Cantidad de personas</label>
            <select 
                value={tamano_id} 
                onChange={CapturarTamanoIDyNombre} 
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[#f57fa6] focus:border-transparent transition-all outline-none"
            >
                {tamano_producto?.map((item,index) => (<option key={index} value={item.tamano_id}>{item.tamano}</option>))}
            </select>
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Fecha de entrega</label>
            <input 
                value={fechaEntrega} 
                type="date" 
                onChange={e => setFechaEntrega(e.target.value)} 
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#f57fa6] focus:border-transparent decoration-0 transition-all outline-none"
            />
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Sabor</label>
            <select 
                value={sabor_id} 
                onChange={CapturarSaborIDyNombre} 
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[#f57fa6] focus:border-transparent transition-all outline-none"
            >
                {sabor_producto.map((item,index) => (<option key={index} value={item.sabor_id}>{item.sabores.nombre}</option>))}
            </select>
        </div>

        <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">¿Desea agregar nombre y/o edad?</label>
            <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                        checked={agregaNombreEdad==true} 
                        type="radio" 
                        name="agregar_datos" 
                        onChange={() => setagregaNombreEdad(true)}
                        className="w-4 h-4 text-pink-600 focus:ring-[#f57fa6] cursor-pointer"
                    />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Sí</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                        checked={agregaNombreEdad==false}
                        type="radio" 
                        name="agregar_datos" 
                        onChange={() => setagregaNombreEdad(false)}
                        className="w-4 h-4 text-[#f57fa6] focus:ring-[#f57fa6] cursor-pointer"
                    />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">No</span>
                </label>
            </div>
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Método de envío</label>
            <select 
                value={metodoEnvio} 
                onChange={e => setMetodoEnvio(e.target.value)} 
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all outline-none"
            >
                <option value="Domicilio">Retiro en domicilio</option>
                <option value="UberFlash">UberFlash</option>
                <option value="Metro">Metro</option>
                {tipo_formulario == "lunchcake" && (<option value="Delivery">Delivery</option>)}
            </select>
        </div>

        <button 
            type="submit" 
            disabled={esconder}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 rounded-lg hover:cursor-pointer transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg mt-2"
        >
            {esconder ? "Agregando..." : "Agregar al carrito"}
        </button>
    </form>
)
}