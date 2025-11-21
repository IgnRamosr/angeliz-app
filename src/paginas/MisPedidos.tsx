import { useEffect, useState } from "react"
import { listarPedidosUsuario } from "../hooks/useOrders"
import type { PedidoConItems } from "../assets/types-interfaces/types";
import { Package, Calendar, Cake, Users, Truck, Clock } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUserRole } from "../hooks/useUserProfile";

export const MisPedidos = () => {
const [items, setItems] = useState<PedidoConItems[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const redirigir = useNavigate();
const {esAdmin} = useUserRole();

useEffect(() => {
(async () => {
try {
const items = await listarPedidosUsuario();
setItems(items);
} catch (error) {
console.error(error);
} finally {
setLoading(false);
}
})();
}, [])


if (esAdmin) {
    return <Navigate to="/admin" replace />;
}


if (loading) {
return (
<div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
<div className="text-center">
    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
    <p className="mt-4 text-gray-600 font-medium">Cargando tus pedidos...</p>
</div>
</div>
);
}

if (!items.length) {
return (
<div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4">
<div className="text-center max-w-md">
    <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
        <Package className="w-12 h-12 text-pink-400" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">No tienes pedidos aún</h2>
    <p className="text-gray-600 mb-6">¡Realiza tu primer pedido de deliciosas tortas y galletas!</p>
    <button onClick={() => {redirigir("/")}} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:cursor-pointer transition-all duration-300 transform hover:-translate-y-1">
        Explorar productos
    </button>
</div>
</div>
);
}

return (
<div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
<div className="max-w-4xl mx-auto">
{/* Header */}
<div className="mb-8">
    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
        <Package className="w-8 h-8 text-pink-500" />
        Mis Pedidos
    </h1>
    <p className="text-gray-600">Historial de tus pedidos</p>
</div>

{/* Lista de Pedidos */}
<div className="space-y-4">
    {items.map((item) => (
        <div 
            key={item.id} 
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
            {/* Header del Pedido */}
            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                            Pedido #{item.id}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-purple-500" />
                                <span>Fecha de solicitud: {item.fecha_solicitud}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Cake className="w-4 h-4 text-pink-500" />
                                <span>{item.items_pedido.length} {item.items_pedido.length === 1 ? 'producto' : 'productos'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detalles de Items */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                    {item.items_pedido.map(it => {
                        const productoNombre = it.nombre?.nombre ?? "No hay nombre";
                        const ft = it.formulario_torta;
                        const tamano = ft?.tamano.tamano ?? "No hay tamano";
                        const sabor = ft?.sabor_nombre.nombre ?? "No hay sabor";
                        const fecha = ft?.fecha_entrega ?? "No hay fecha";
                        const envio = ft?.metodo_envio ?? "No hay metodo de envío";

                        return (
                            <div 
                                key={it.id} 
                                className="bg-gradient-to-br from-pink-50/50 to-purple-50/50 rounded-xl p-4"
                            >
                                <h4 className="font-bold text-gray-800 mb-3 text-base flex items-center gap-2">
                                    <Cake className="w-5 h-5 text-pink-500" />
                                    {productoNombre}
                                </h4>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <Users className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <span className="font-semibold text-gray-700">Cantidad de personas: </span>
                                            <span className="text-gray-600">{tamano}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <Cake className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <span className="font-semibold text-gray-700">Sabor: </span>
                                            <span className="text-gray-600">{sabor}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <Calendar className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <span className="font-semibold text-gray-700">Fecha: </span>
                                            <span className="text-gray-600">{fecha}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <Truck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <span className="font-semibold text-gray-700">Envío: </span>
                                            <span className="text-gray-600">{envio}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    ))}
</div>
</div>
</div>
);
}