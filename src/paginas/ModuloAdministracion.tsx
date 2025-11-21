// src/pages/ModuloAdministracion.tsx
import { Navigate } from "react-router-dom";
import { useUserRole } from "../hooks/useUserProfile";
import CalendarioDisponibilidad from "../componentes/CalendarioDisponibilidad";
import PedidosAdminTabla from "../componentes/PedidosAdminTabla";
import { Loader2, ShoppingBag, Calendar, LayoutDashboard } from "lucide-react";
import { useState } from "react";

export default function AdminApp() {
  const { esAdmin, cargando } = useUserRole();
  const [tabActiva, setTabActiva] = useState<"pedidos" | "disponibilidad">("pedidos");

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#6F2521] animate-spin" />
          <p className="text-lg text-gray-600 font-medium">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!esAdmin) {
    return <Navigate to="/pedidos" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#6F2521] to-[#8B3330] rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-500 text-sm mt-1">Gestiona pedidos y disponibilidad</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6 border-b border-gray-200">
            <button
              onClick={() => setTabActiva("pedidos")}
              className={`
                flex items-center gap-2 px-6 py-3 font-semibold
                border-b-2 transition-all duration-200
                ${tabActiva === "pedidos"
                  ? "border-[#6F2521] text-[#6F2521]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Pedidos</span>
            </button>

            <button
              onClick={() => setTabActiva("disponibilidad")}
              className={`
                flex items-center gap-2 px-6 py-3 font-semibold
                border-b-2 transition-all duration-200
                ${tabActiva === "disponibilidad"
                  ? "border-[#6F2521] text-[#6F2521]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <Calendar className="w-5 h-5" />
              <span>Disponibilidad</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Pedidos */}
        {tabActiva === "pedidos" && (
          <section className="animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#6F2521] to-[#8B3330] px-6 py-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6" />
                  Gestión de Pedidos
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  Los pedidos más recientes aparecen primero
                </p>
              </div>
              
              <div className="p-6">
                <PedidosAdminTabla />
              </div>
            </div>
          </section>
        )}

        {/* Tab Disponibilidad */}
        {tabActiva === "disponibilidad" && (
          <section className="animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#6F2521] to-[#8B3330] px-6 py-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Calendar className="w-6 h-6" />
                  Gestión de Disponibilidad
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  Configura los días y horarios disponibles
                </p>
              </div>
              
              <div className="p-6">
                <CalendarioDisponibilidad />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}