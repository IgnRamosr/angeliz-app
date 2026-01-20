import { useEffect, useState } from "react";
import {useCartFunctions} from "../hooks/useCartFunctions"
import type { CarritoItem, UID } from "../assets/types-interfaces/types";
import { useNavigate } from "react-router-dom";
import { useCart } from "../componentes/Navegacion/useCart";
import { generaSolicitud } from "../hooks/useCheckoutFunction";
import { toast } from "react-toastify";
import { Cake, Calendar, Edit3, ShoppingBag, Trash2, Users, Stars } from "lucide-react";
import { useRef } from "react";
import  FormularioContacto, {type FormularioContactoRef}  from "../componentes/ModuloCliente/FormularioContacto";
import { supabase } from "../supabase/supabaseClient";
import type { datosFormContacto } from '../assets/types-interfaces/interfaces';




export const CarritoDeCompras = () => {
  const { listarProductosCarrito, eliminarProductoCarrito, vaciarProductosCarrito } = useCartFunctions();
  const [, setItems] = useState<CarritoItem[]>([]);
  const [sesion, setSession] = useState<boolean>();
  const [loading, setLoading] = useState(true);
  const {eliminarItem} = useCart();
  const redirigir = useNavigate();

  const refContacto = useRef<FormularioContactoRef>(null);

  const { items , vaciarCarrito  } = useCart();
  
  

  const manejarConfirmacion = async () => {
    try {
      let datos: datosFormContacto | undefined = undefined;

      if (sesion) { // sesion === true => anónimo según tu código
        const res = refContacto.current?.getdatosFormContacto();
        if (!res) return; // el componente ya mostró los mensajes de error
        datos = res;
      }

      await generaSolicitud(items, datos);
      vaciarCarrito();
      vaciarProductosCarrito();
      redirigir("/solicitudExitosa");
    } catch (e) {
      console.error(e);
      toast.clearWaitingQueue();
      toast.error("Ocurrió un error al generar la solicitud");
      redirigir("/");
    }
  };



  useEffect(() => {
    (async () => {
        try {
          const sesion = await supabase.auth.getUser();
          setSession(sesion.data.user?.is_anonymous);
          const item = await listarProductosCarrito();
          setItems(item);
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
    })();
  }, []);

  const eliminarItemCarrito = async (uid: UID) => {
    await eliminarProductoCarrito(uid);
    eliminarItem(uid);
    setItems(item => item.filter(it => it.uid !== uid));
  }

  const editarItem = (item: CarritoItem) => {
    const atributosAcambiar = {
      uid: item.uid,
      tamano: item.tamano,
      tamano_id: item.tamano_id,
      sabor_id: item.sabor_id,
      sabor_nombre: item.sabor_nombre,
      fecha_entrega: item.fecha_entrega,
      metodo_envio: item.metodo_envio,
      agregaNombreEdad: item.agregaNombreEdad
    };

    redirigir(`/producto/${item.producto_id}?editar=${item.uid}`, { state: { atributosAcambiar } });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando tu carrito...</p>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ShoppingBag className="w-12 h-12 text-pink-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">¡Agrega deliciosas tortas y galletas para comenzar!</p>
          <button onClick={() => {redirigir("/")}} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:cursor-pointer transition-all duration-300 transform hover:-translate-y-1">
            Explorar Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-[#6F2521]" />
            Mi Carrito
          </h1>
          <p className="text-gray-600">{items.length} {items.length === 1 ? 'producto' : 'productos'} en tu carrito</p>
        </div>

        {/* Lista de Items */}
        <div className="space-y-4 mb-6">
          {items.map(item => (
            <div key={item.uid} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="flex flex-col md:flex-row gap-4 p-4 sm:p-6">
                {/* Imagen */}
                <div className="w-full md:w-48 h-48 md:h-40 flex-shrink-0">
                  <img 
                    src={item.imagen_url} 
                    alt={item.nombre_producto}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                {/* Contenido */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Cake className="w-5 h-5 text-[#C9A742]" />
                      {item.nombre_producto}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#f57fa6]" />
                        <span><strong>Personas:</strong> {item.tamano} personas</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Cake className="w-4 h-4 text-[#f57fa6]" />
                        <span><strong>Sabor:</strong> {item.sabor_nombre}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#f57fa6]" />
                        <span><strong>Entrega:</strong> {new Date(item.fecha_entrega).toLocaleDateString('es-CL')}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Stars className="w-4 h-4 text-[#f57fa6]"/>
                        <span><strong>Agrega nombre y/o edad:</strong> {item.agregaNombreEdad == null ? "—" : item.agregaNombreEdad ? "Sí" : "No"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button 
                      onClick={() => editarItem(item)}
                      className="flex-1 sm:flex-none bg-[#C9A742] hover:bg-[#6F2521] text-white px-4 py-2 rounded-lg font-medium hover:shadow-md hover:cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      Actualizar
                    </button>
                    
                    <button 
                      onClick={() => eliminarItemCarrito(item.uid)}
                      className="flex-1 sm:flex-none bg-[#C9A742] hover:bg-[#6F2521] text-white px-4 py-2 rounded-lg font-medium hover:shadow-md hover:cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sesion &&(
          <FormularioContacto ref={refContacto}/>
        )}

        {/* Botón de Confirmación */}
        <div className="sticky bottom-4 bg-white rounded-2xl shadow-2xl p-4 sm:p-6">
          <button 
            onClick={manejarConfirmacion}
            className="w-full bg-[#6F2521] hover:bg-[#C9A742] text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:cursor-pointer transform hover:-translate-y-1 hover:scale-[1.02]"
          >
            Confirmar Pedido
          </button>
          <p className="text-center text-xs text-gray-500 mt-3">
            Al confirmar, enviarás tu solicitud de pedido
          </p>
        </div>
      </div>
    </div>
  );
}
