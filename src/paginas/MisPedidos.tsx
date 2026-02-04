import { useEffect, useState } from "react"
import { listarPedidosUsuario } from "../hooks/useOrders"
import type { PedidoConItems } from "../assets/types-interfaces/types";
import { Package, Calendar, Cake, Users, Truck, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUserRole } from "../hooks/useUserProfile";
import { formatearFechaHoraCorta } from "../utils/fechas";

export const MisPedidos = () => {
    const [items, setItems] = useState<PedidoConItems[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [pedidosAbiertos, setPedidosAbiertos] = useState<Set<number>>(new Set());
    const redirigir = useNavigate();
    const {esAdmin} = useUserRole();



    useEffect(() => {
        (async () => {
            try {
                const items = await listarPedidosUsuario();
                setItems(items);
                // Abrir el primer pedido por defecto
                if (items.length > 0) {
                    setPedidosAbiertos(new Set([items[0].id]));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [])

    const togglePedido = (pedidoId: number) => {
        setPedidosAbiertos(prev => {
            const nuevoSet = new Set(prev);
            if (nuevoSet.has(pedidoId)) {
                nuevoSet.delete(pedidoId);
            } else {
                nuevoSet.add(pedidoId);
            }
            return nuevoSet;
        });
    };

    const estaAbierto = (pedidoId: number) => pedidosAbiertos.has(pedidoId);

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
                    <p className="text-gray-600">Historial de tus {items.length} {items.length === 1 ? 'pedido' : 'pedidos'}</p>
                </div>

                {/* Lista de Pedidos con Acordeón */}
                <div className="space-y-4">
                    {items.map((item) => {
                        const isOpen = estaAbierto(item.id);
                        
                        return (
                            <div 
                                key={item.id} 
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-pink-200"
                            >
                                {/* Header del Pedido - Clickeable para expandir/contraer */}
                                <button
                                    onClick={() => togglePedido(item.id)}
                                    className="w-full p-4 sm:p-6 text-left hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-purple-50/50 transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                                <div className="bg-gradient-to-br from-pink-500 to-purple-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
                                                    Pedido #{item.id}
                                                </div>
                                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                    isOpen 
                                                        ? 'bg-pink-100 text-pink-700' 
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    <Cake className="w-3.5 h-3.5" />
                                                    {item.items_pedido.length} {item.items_pedido.length === 1 ? 'producto' : 'productos'}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                <Clock className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                                    <span className="font-semibold">Solicitado:</span>
                                                    {/* Usa formatearFechaHora para formato largo o formatearFechaHoraCorta para formato corto */}
                                                    <span className="text-gray-700">{formatearFechaHoraCorta(item.fecha_solicitud)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Icono de expandir/contraer */}
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                            isOpen 
                                                ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}>
                                            {isOpen ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </div>
                                    </div>
                                </button>

                                {/* Contenido expandible del Pedido */}
                                <div 
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                        isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="px-4 sm:px-6 pb-6 pt-2">
                                        <div className="border-t-2 border-dashed border-gray-200 pt-4 space-y-4">
                                            {item.items_pedido.map((it, index) => {
                                                const productoNombre = it.nombre?.nombre ?? "No hay nombre";
                                                const ft = it.formulario_torta;
                                                const tamano = ft?.tamano.tamano ?? "No hay tamano";
                                                const sabor = ft?.sabor_nombre.nombre ?? "No hay sabor";
                                                const fecha = ft?.fecha_entrega ?? "No hay fecha";
                                                const envio = ft?.metodo_envio ?? "No hay metodo de envío";

                                                return (
                                                    <div 
                                                        key={it.id} 
                                                        className="bg-gradient-to-br from-pink-50/50 to-purple-50/50 rounded-xl p-4 sm:p-5 border-2 border-pink-100 hover:border-pink-300 transition-all duration-200 hover:shadow-md"
                                                        style={{
                                                            animation: isOpen ? `slideIn 0.3s ease-out ${index * 0.1}s both` : 'none'
                                                        }}
                                                    >
                                                        {/* Header del producto */}
                                                        <div className="flex items-start justify-between mb-4">
                                                            <h4 className="font-bold text-gray-800 text-base sm:text-lg flex items-center gap-2 flex-1">
                                                                <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-1.5 rounded-lg">
                                                                    <Cake className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                                                </div>
                                                                <span className="break-words">{productoNombre}</span>
                                                            </h4>
                                                            <div className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-purple-600 shadow-sm ml-2 flex-shrink-0">
                                                                #{index + 1}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Detalles del producto */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <div className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                                                                <div className="flex items-start gap-2">
                                                                    <div className="bg-purple-100 p-1.5 rounded-lg flex-shrink-0">
                                                                        <Users className="w-4 h-4 text-purple-600" />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <span className="font-semibold text-gray-700 text-xs sm:text-sm block">Personas</span>
                                                                        <span className="text-gray-600 text-sm sm:text-base break-words">{tamano}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                                                                <div className="flex items-start gap-2">
                                                                    <div className="bg-pink-100 p-1.5 rounded-lg flex-shrink-0">
                                                                        <Cake className="w-4 h-4 text-pink-600" />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <span className="font-semibold text-gray-700 text-xs sm:text-sm block">Sabor</span>
                                                                        <span className="text-gray-600 text-sm sm:text-base break-words">{sabor}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                                                                <div className="flex items-start gap-2">
                                                                    <div className="bg-blue-100 p-1.5 rounded-lg flex-shrink-0">
                                                                        <Calendar className="w-4 h-4 text-blue-600" />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <span className="font-semibold text-gray-700 text-xs sm:text-sm block">Entrega</span>
                                                                        <span className="text-gray-600 text-sm sm:text-base break-words">{fecha}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                                                                <div className="flex items-start gap-2">
                                                                    <div className="bg-green-100 p-1.5 rounded-lg flex-shrink-0">
                                                                        <Truck className="w-4 h-4 text-green-600" />
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <span className="font-semibold text-gray-700 text-xs sm:text-sm block">Envío</span>
                                                                        <span className="text-gray-600 text-sm sm:text-base break-words">{envio}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CSS para la animación de slide-in */}
            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}