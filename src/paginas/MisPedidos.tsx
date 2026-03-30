import { useEffect, useState } from "react";
import { listarPedidosUsuario } from "../hooks/useOrders";
import type { PedidoConItems } from "../assets/types-interfaces/types";
import {
  Package, Calendar, Cake, Users, Truck,
  Clock, ChevronDown, ChevronUp, Cookie, ImageIcon, X,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUserRole } from "../hooks/useUserProfile";
import { formatearFechaHoraCorta } from "../utils/fechas";
import { importarImagenReferenciaPorRuta } from "../hooks/useUploadImageSupabase";
import { createPortal } from "react-dom";

// ── Modal de imagen ──────────────────────────────────────────────────────────

const ModalImagen = ({ url, onCerrar }: { url: string; onCerrar: () => void }) =>
  createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onCerrar}
    >
      <div
        className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onCerrar}
          className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all hover:scale-110"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
        <img
          src={url}
          alt="Imagen de referencia"
          className="w-full h-auto max-h-[75vh] object-contain p-2"
        />
      </div>
    </div>,
    document.body  // 👈 esto es lo clave
  );

// ── Botón ver imagen ─────────────────────────────────────────────────────────
const BotonVerImagen = ({ ruta, bucket }: { ruta: string; bucket: string }) => {
  const [urlModal, setUrlModal] = useState<string | null>(null);

  const abrirImagen = () => {
    const url = importarImagenReferenciaPorRuta(ruta, bucket);
    setUrlModal(url);
  };

  return (
    <>
      <button
        onClick={abrirImagen}
        className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-colors"
      >
        <ImageIcon className="w-4 h-4" />
        Ver imagen de referencia
      </button>

      {urlModal && (
        <ModalImagen url={urlModal} onCerrar={() => setUrlModal(null)} />
      )}
    </>
  );
};

// ── Subcomponente: detalle de torta ──────────────────────────────────────────
const DetalleTorta = ({ ft, nombre }: { ft: NonNullable<any>; nombre: string }) => {
  const rows = [
    { icon: <Users    className="w-4 h-4 text-purple-600" />, bg: "bg-purple-100", label: "Personas", value: ft.tamano?.tamano      ?? "—" },
    { icon: <Cake     className="w-4 h-4 text-pink-600"   />, bg: "bg-pink-100",   label: "Sabor",    value: ft.sabor_nombre?.nombre ?? "—" },
    { icon: <Calendar className="w-4 h-4 text-blue-600"   />, bg: "bg-blue-100",   label: "Entrega",  value: ft.fecha_entrega         ?? "—" },
    { icon: <Truck    className="w-4 h-4 text-green-600"  />, bg: "bg-green-100",  label: "Envío",    value: ft.metodo_envio           ?? "—" },
  ];

  return (
    <>
      <DetalleGrid rows={rows} />
      {nombre.toLowerCase().includes("crea") && ft.ruta_imagen_referencia && (
        <BotonVerImagen ruta={ft.ruta_imagen_referencia} bucket="torta" />
      )}
    </>
  );
};

// ── Subcomponente: detalle de galletas ───────────────────────────────────────
const DetalleGalletas = ({ fg, nombre }: { fg: NonNullable<any>; nombre: string }) => {
  const rows = [
    { icon: <Cookie   className="w-4 h-4 text-yellow-600" />, bg: "bg-yellow-100", label: "Cantidad", value: fg.cantidad      ?? "—" },
    { icon: <Calendar className="w-4 h-4 text-blue-600"   />, bg: "bg-blue-100",   label: "Entrega",  value: fg.fecha_entrega ?? "—" },
    { icon: <Truck    className="w-4 h-4 text-green-600"  />, bg: "bg-green-100",  label: "Envío",    value: fg.metodo_envio  ?? "—" },
  ];

  return (
    <>
      <DetalleGrid rows={rows} />
      {fg.detalle && (
        <div className="bg-white rounded-lg p-3 shadow-sm mt-2">
          <span className="font-semibold text-gray-700 text-xs sm:text-sm block mb-1">Detalle</span>
          <p className="text-gray-600 text-sm whitespace-pre-wrap">{fg.detalle}</p>
        </div>
      )}
      {nombre.toLowerCase().includes("crea") && fg.ruta_imagen_referencia && (
        <BotonVerImagen ruta={fg.ruta_imagen_referencia} bucket="galletas" />
      )}
    </>
  );
};

// ── Subcomponente genérico: grilla de filas ──────────────────────────────────
type Row = { icon: React.ReactNode; bg: string; label: string; value: string | number };
const DetalleGrid = ({ rows }: { rows: Row[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {rows.map(({ icon, bg, label, value }) => (
      <div key={label} className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-2">
          <div className={`${bg} p-1.5 rounded-lg flex-shrink-0`}>{icon}</div>
          <div className="min-w-0 flex-1">
            <span className="font-semibold text-gray-700 text-xs sm:text-sm block">{label}</span>
            <span className="text-gray-600 text-sm sm:text-base break-words">{value}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ── Componente principal ─────────────────────────────────────────────────────
export const MisPedidos = () => {
  const [items, setItems]                     = useState<PedidoConItems[]>([]);
  const [loading, setLoading]                 = useState<boolean>(true);
  const [pedidosAbiertos, setPedidosAbiertos] = useState<Set<number>>(new Set());
  const redirigir   = useNavigate();
  const { esAdmin } = useUserRole();

  useEffect(() => {
    (async () => {
      try {
        const data = await listarPedidosUsuario();
        setItems(data);
        if (data.length > 0) setPedidosAbiertos(new Set([data[0].id]));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (esAdmin) return <Navigate to="/admin" />;

  const togglePedido = (id: number) =>
    setPedidosAbiertos(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent" />
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
          <button
            onClick={() => redirigir("/")}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
          >
            Explorar productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Package className="w-8 h-8 text-pink-500" />
            Mis Pedidos
          </h1>
          <p className="text-gray-600">
            Historial de tus {items.length} {items.length === 1 ? "pedido" : "pedidos"}
          </p>
        </div>

        <div className="space-y-4">
          {items.map(pedido => {
            const isOpen = pedidosAbiertos.has(pedido.id);
            return (
              <div
                key={pedido.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-pink-200"
              >
                {/* Header del pedido */}
                <button
                  onClick={() => togglePedido(pedido.id)}
                  className="w-full p-4 sm:p-6 text-left hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-purple-50/50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <div className="bg-gradient-to-br from-pink-500 to-purple-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
                          Pedido #{pedido.id}
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isOpen ? "bg-pink-100 text-pink-700" : "bg-gray-100 text-gray-600"}`}>
                          <Cake className="w-3.5 h-3.5" />
                          {pedido.items_pedido.length} {pedido.items_pedido.length === 1 ? "producto" : "productos"}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                          <span className="font-semibold">Solicitado:</span>
                          <span className="text-gray-700">{formatearFechaHoraCorta(pedido.fecha_solicitud)}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </button>

                {/* Contenido expandible */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-4 sm:px-6 pb-6 pt-2">
                    <div className="border-t-2 border-dashed border-gray-200 pt-4 space-y-4">
                      {pedido.items_pedido.map((it, index) => {
                        const esGalleta = it.nombre.nombre.includes("galletas");
                        const nombre    = it.nombre?.nombre ?? "Sin nombre";
                        const Icon      = esGalleta ? Cookie : Cake;

                        return (
                          <div
                            key={it.id}
                            className="bg-gradient-to-br from-pink-50/50 to-purple-50/50 rounded-xl p-4 sm:p-5 border-2 border-pink-100 hover:border-pink-300 transition-all duration-200 hover:shadow-md"
                            style={{ animation: isOpen ? `slideIn 0.3s ease-out ${index * 0.1}s both` : "none" }}
                          >
                            {/* Header del producto */}
                            <div className="flex items-start justify-between mb-4">
                              <h4 className="font-bold text-gray-800 text-base sm:text-lg flex items-center gap-2 flex-1">
                                <div className="bg-gradient-to-br from-pink-500 to-purple-500 p-1.5 rounded-lg">
                                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </div>
                                <span className="break-words">{nombre}</span>
                              </h4>
                              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${esGalleta ? "bg-yellow-100 text-yellow-700" : "bg-pink-100 text-pink-700"}`}>
                                  {esGalleta ? "Galletas" : "Torta"}
                                </span>
                                <div className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-purple-600 shadow-sm">
                                  #{index + 1}
                                </div>
                              </div>
                            </div>

                            {/* Detalles según tipo */}
                            {esGalleta
                              ? <DetalleGalletas fg={it.formulario_galletas} nombre={it.nombre.nombre} />
                              : <DetalleTorta    ft={it.formulario_torta} nombre={it.nombre.nombre}    />
                            }
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

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0);     }
        }
      `}</style>
    </div>
  );
};