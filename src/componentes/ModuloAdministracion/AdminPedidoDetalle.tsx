// pages/AdminPedidoDetalle.tsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { actualizarEstadoPedido, obtenerPedidoDetalleAdmin } from "../../hooks/useOrders";
import type { EstadoPedido } from "../../assets/types-interfaces/types";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  User,
  Phone,
  Calendar,
  Package,
  ShoppingBag,
  Cake,
  Users,
  Eye,
  AlbumIcon,
  Cookie,
  CheckCircle2,
  Truck,
  Mail
} from "lucide-react";

const ESTADOS: EstadoPedido[] = ["En revisión", "Contactado", "Confirmado", "En camino", "Entregado", "Cancelado"];

const ESTADO_ESTILOS: Record<EstadoPedido, string> = {
  "En revisión":  "bg-amber-100 text-amber-800 border-amber-300",
  "Contactado":   "bg-blue-100 text-blue-800 border-blue-300",
  "Confirmado":   "bg-green-100 text-green-800 border-green-300",
  "En camino":    "bg-indigo-100 text-indigo-800 border-indigo-300",
  "Entregado":    "bg-emerald-100 text-emerald-800 border-emerald-300",
  "Cancelado":    "bg-red-100 text-red-800 border-red-300",
};

// ⬇️ Reutilizamos tus utilidades
import { buildWhatsAppHrefFromPedido, fmtFecha, openWhatsApp } from "../../utils/whatsapp";
import { importarImagenReferenciaPorRuta } from "../../hooks/useUploadImageSupabase";
import { ymd } from "../../utils/fechas";
import { supabase } from "../../supabase/supabaseClient";

export default function AdminPedidoDetalle() {
  const { id } = useParams();
  const pedidoId = Number(id);

  const [cargando, setCargando] = useState(true);
  const [cabecera, setCabecera] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [imagenAbierta, setImagenAbierta] = useState<string | null>(null);
  const [detalleAbierto, setDetalleAbierto] = useState<string | null>(null);
  const [estado, setEstado] = useState<EstadoPedido | null>(null);
  const [guardandoEstado, setGuardandoEstado] = useState(false);
  const [estadoGuardado, setEstadoGuardado] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { cabecera, items } = await obtenerPedidoDetalleAdmin(pedidoId);
        setCabecera(cabecera);
        setItems(items);
        setEstado(cabecera?.estado ?? null);
      } catch (e: any) {
        setError(e?.message ?? "Error cargando detalle");
      } finally {
        setCargando(false);
      }
    })();
  }, [pedidoId]);

  async function handleGuardarEstado() {
    if (!estado) return;
    setGuardandoEstado(true);
    try {
      await actualizarEstadoPedido(pedidoId, estado);

      supabase.functions.invoke("enviar-email-estado", {
        body: { pedidoId, nuevoEstado: estado },
      }).catch((e) => console.warn("No se pudo enviar correo:", e?.message));

      setEstadoGuardado(true);
      setTimeout(() => setEstadoGuardado(false), 3000);
    } catch (e) {
      console.error("Error al actualizar estado:", e);
    } finally {
      setGuardandoEstado(false);
    }
  }

  // Construimos el href de WhatsApp a partir de la cabecera + items ya cargados
const waHref = useMemo(() => {
    if (!cabecera) return null;

    const itemsAdaptados = (items ?? []).map((it) => ({
        nombre_producto: it.producto_nombre ?? "Producto",
        tipo_formulario: it.tipo_formulario ?? null,
        tamano: it.tamano_personas ?? null,
        sabor_nombre: it.sabor_nombre ?? null,
        ruta_imagen_referencia: it.ruta_imagen_referencia ?? null,
        detalle: it.detalle ?? it.detalle_minicake ?? it.detalle_galletas ?? null,
        agregar_nombre_edad: it.agregar_nombre_edad ?? null,
        cantidad: it.cantidad ?? null
    }));

    return buildWhatsAppHrefFromPedido({
      id: cabecera.pedido_id,
      contacto_nombre: cabecera.cliente_nombre,
      contacto_apellido: cabecera.cliente_apellido,
      contacto_telefono: cabecera.cliente_telefono,
      fecha_solicitud: cabecera.fecha_solicitud,
      fecha_entrega: cabecera.fecha_entrega,
      metodo_envio: cabecera.metodo_envio,
      hora_retiro: cabecera.hora_retiro,
      items: itemsAdaptados,
    });
}, [cabecera, items]);

  // Estados de carga y error
  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#6F2521] animate-spin" />
          <p className="text-lg text-gray-600 font-medium">Cargando detalle del pedido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto mt-12">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-red-800 mb-2">Error al cargar</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver al panel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cabecera) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto mt-12">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Pedido no encontrado</h3>
            <p className="text-gray-600 mb-6">No existe el pedido #{pedidoId}.</p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#6F2521] text-white rounded-lg hover:bg-[#5a1e1a] transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al panel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Botón Volver */}
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-[#6F2521] hover:text-[#5a1e1a] font-medium transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Volver al panel
        </Link>

        {/* Cabecera del Pedido */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-[#6F2521] to-[#8B3330] px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <ShoppingBag className="w-7 h-7" />
                Pedido #{cabecera.pedido_id}
              </h1>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white font-medium text-sm w-fit">
                  <Calendar className="w-4 h-4" />
                  {ymd(new Date(/Z|[+-]\d{2}:\d{2}$/.test(cabecera.fecha_solicitud) ? cabecera.fecha_solicitud : cabecera.fecha_solicitud + "Z"))}
                </span>

                {/* Botón directo a WhatsApp (opcional extra) */}
                <button
                  type="button"
                  onClick={() => openWhatsApp(waHref)}
                  disabled={!waHref}
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white text-[#6F2521] rounded-lg hover:bg-pink-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Contactar por WhatsApp"
                >
                  WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Estado del pedido */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Estado del pedido</h2>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={estado ?? ""}
                onChange={(e) => setEstado(e.target.value as EstadoPedido)}
                className={`px-4 py-2 rounded-xl border-2 font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#6F2521]/20 ${estado ? ESTADO_ESTILOS[estado] : "border-gray-200 text-gray-500"}`}
              >
                {ESTADOS.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
              <button
                onClick={handleGuardarEstado}
                disabled={guardandoEstado || estado === cabecera?.estado}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#6F2521] text-white rounded-xl font-semibold text-sm hover:bg-[#5a1e1a] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {guardandoEstado ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Guardando…</>
                ) : estadoGuardado ? (
                  <><CheckCircle2 className="w-4 h-4" /> Guardado</>
                ) : (
                  "Guardar estado"
                )}
              </button>
            </div>
          </div>

          {/* Información del Cliente */}
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#6F2521]" />
              Información del Cliente
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Nombre */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#6F2521]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-[#6F2521]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Cliente</p>
                    <p className="font-semibold text-gray-800 truncate">
                      {cabecera.cliente_nombre ?? "—"} {cabecera.cliente_apellido ?? ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Teléfono – hace click y abre WhatsApp con el detalle */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#6F2521]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#6F2521]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Teléfono</p>
                    {cabecera.cliente_telefono ? (
                      <button
                        type="button"
                        onClick={() => openWhatsApp(waHref)}
                        disabled={!waHref}
                        className="font-semibold text-[#6F2521] hover:text-[#8B3330] underline underline-offset-2 disabled:no-underline disabled:text-gray-400"
                        title="Abrir WhatsApp con el detalle del pedido"
                      >
                        {cabecera.cliente_telefono}
                      </button>
                    ) : (
                      <span className="font-semibold text-gray-400">—</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Fecha y hora */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#6F2521]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-[#6F2521]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Fecha de solicitud</p>
                    <p className="font-semibold text-gray-800">
                      {fmtFecha(cabecera.fecha_solicitud)}
                    </p>
                  </div>
                </div>
              </div>

            {/* Correo */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#6F2521]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#6F2521]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Correo</p>
                  <p className="font-semibold text-gray-800 truncate">
                    {cabecera.cliente_email ?? "—"}
                  </p>
                </div>
              </div>
            </div>

              {/* Fecha de entrega */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#6F2521]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-[#6F2521]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Fecha de entrega</p>
                    <p className="font-semibold text-gray-800">
                      {cabecera.fecha_entrega ? new Date(cabecera.fecha_entrega).toLocaleDateString("es-CL") : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Envío */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#6F2521]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-[#6F2521]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Envío</p>
                    <p className="font-semibold text-gray-800">
                      {cabecera.metodo_envio ?? "—"}{cabecera.hora_retiro ? ` · ${cabecera.hora_retiro}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ítems del Pedido */}
<div className="p-4 sm:p-6 space-y-8">
  {!items.length ? (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-600 font-medium">Este pedido no tiene ítems asociados.</p>
    </div>
  ) : (
    <>
      {/* ── TABLA TORTAS ── */}
      {items.some(it => it.tipo_formulario === "torta") && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Cake className="w-5 h-5 text-[#6F2521]" />
            Tortas
          </h3>

          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Producto</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Personas</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Sabor</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Personalizado</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Imagen</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(it => it.tipo_formulario === "torta").map((it, idx) => (
                  <tr key={it.item_id} className={`border-b last:border-0 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {it.producto_imagen && (
                          <img src={it.producto_imagen} alt={it.producto_nombre ?? ""} className="w-14 h-14 object-cover rounded-lg border-2 border-gray-200 flex-shrink-0" />
                        )}
                        <span className="font-medium text-gray-800">{it.producto_nombre ?? "—"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                        <Users className="w-4 h-4" />{it.tamano_personas ?? "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                        <Cake className="w-4 h-4" />{it.sabor_nombre ?? "—"}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${it.agregar_nombre_edad ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                        {it.agregar_nombre_edad == null ? "—" : it.agregar_nombre_edad ? "Sí" : "No"}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        onClick={() => { if (!it.ruta_imagen_referencia) return; setImagenAbierta(importarImagenReferenciaPorRuta(it.ruta_imagen_referencia, it.tipo_formulario)); }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${it.ruta_imagen_referencia ? "bg-indigo-50 text-indigo-700 cursor-pointer hover:bg-indigo-100" : "bg-gray-100 text-gray-400"}`}
                      >
                        <Eye className="w-4 h-4" />{it.ruta_imagen_referencia ? "Ver" : "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        onClick={() => { if (!it.detalle) return; setDetalleAbierto(it.detalle); }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${it.detalle ? "bg-indigo-50 text-indigo-700 cursor-pointer hover:bg-indigo-100" : "bg-gray-100 text-gray-400"}`}
                      >
                        <AlbumIcon className="w-4 h-4" />{it.detalle ? "Ver" : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile - Tortas */}
          <div className="lg:hidden space-y-4">
            {items.filter(it => it.tipo_formulario === "torta").map((it) => (
              <div key={it.item_id} className="bg-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden hover:border-[#6F2521] transition-colors">
                <div className="bg-white p-4 flex items-center gap-3 border-b border-gray-200">
                  {it.producto_imagen && <img src={it.producto_imagen} alt={it.producto_nombre ?? ""} className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 flex-shrink-0" />}
                  <h3 className="font-semibold text-gray-800 text-lg truncate">{it.producto_nombre ?? "—"}</h3>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { icon: <Users className="w-4 h-4" />, label: "Personas", value: it.tamano_personas ?? "—", bg: "bg-blue-50" },
                    { icon: <Cake className="w-4 h-4" />, label: "Sabor", value: it.sabor_nombre ?? "—", bg: "bg-purple-50" },
                    { icon: null, label: "Personalizado", value: it.agregar_nombre_edad == null ? "—" : it.agregar_nombre_edad ? "Sí" : "No", bg: it.agregar_nombre_edad ? "bg-amber-50" : "bg-gray-100" },
                  ].map(({ icon, label, value, bg }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-2">{icon}{label}</span>
                      <span className={`font-medium text-gray-800 ${bg} px-3 py-1 rounded-lg text-sm`}>{value}</span>
                    </div>
                  ))}
                  {it.ruta_imagen_referencia && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-2"><Eye className="w-4 h-4" />Imagen</span>
                      <span onClick={() => setImagenAbierta(importarImagenReferenciaPorRuta(it.ruta_imagen_referencia, it.tipo_formulario))} className="font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-indigo-100">Ver imagen</span>
                    </div>
                  )}
                  {it.detalle && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-2"><AlbumIcon className="w-4 h-4" />Detalle</span>
                      <span onClick={() => setDetalleAbierto(it.detalle)} className="font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-indigo-100">Ver detalle</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TABLA GALLETAS ── */}
      {items.some(it => it.tipo_formulario === "galletas") && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Cookie className="w-5 h-5 text-[#6F2521]" />
            Galletas
          </h3>

          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Producto</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Cantidad</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Imagen ref.</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(it => it.tipo_formulario === "galletas").map((it, idx) => (
                  <tr key={it.item_id} className={`border-b last:border-0 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {it.producto_imagen && <img src={it.producto_imagen} alt={it.producto_nombre ?? ""} className="w-14 h-14 object-cover rounded-lg border-2 border-gray-200 flex-shrink-0" />}
                        <span className="font-medium text-gray-800">{it.producto_nombre ?? "—"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium">
                        <Cookie className="w-4 h-4" />{it.cantidad ? `${it.cantidad} unid.` : "—"}
                      </span>
                    </td>


                    <td className="p-4">
                      <span
                        onClick={() => { if (!it.ruta_imagen_referencia) return; setImagenAbierta(importarImagenReferenciaPorRuta(it.ruta_imagen_referencia, it.tipo_formulario)); }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${it.ruta_imagen_referencia ? "bg-indigo-50 text-indigo-700 cursor-pointer hover:bg-indigo-100" : "bg-gray-100 text-gray-400"}`}
                      >
                        <Eye className="w-4 h-4" />{it.ruta_imagen_referencia ? "Ver" : "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        onClick={() => { if (!it.detalle_galletas) return; setDetalleAbierto(it.detalle_galletas); }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${it.detalle_galletas ? "bg-indigo-50 text-indigo-700 cursor-pointer hover:bg-indigo-100" : "bg-gray-100 text-gray-400"}`}
                      >
                        <AlbumIcon className="w-4 h-4" />{it.detalle_galletas ? "Ver" : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile - Galletas */}
          <div className="lg:hidden space-y-4">
            {items.filter(it => it.tipo_formulario === "galletas").map((it) => (
              <div key={it.item_id} className="bg-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden hover:border-[#6F2521] transition-colors">
                <div className="bg-white p-4 flex items-center gap-3 border-b border-gray-200">
                  {it.producto_imagen && <img src={it.producto_imagen} alt={it.producto_nombre ?? ""} className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 flex-shrink-0" />}
                  <h3 className="font-semibold text-gray-800 text-lg truncate">{it.producto_nombre ?? "—"}</h3>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { icon: <Cookie className="w-4 h-4" />, label: "Cantidad", value: it.cantidad ? `${it.cantidad} unid.` : "—", bg: "bg-yellow-50" },

                  ].map(({ icon, label, value, bg }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-2">{icon}{label}</span>
                      <span className={`font-medium text-gray-800 ${bg} px-3 py-1 rounded-lg text-sm`}>{value}</span>
                    </div>
                  ))}
                  {it.ruta_imagen_referencia && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-2"><Eye className="w-4 h-4" />Imagen ref.</span>
                      <span onClick={() => setImagenAbierta(importarImagenReferenciaPorRuta(it.ruta_imagen_referencia, it.tipo_formulario))} className="font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-indigo-100">Ver imagen</span>
                    </div>
                  )}
                  {it.detalle_galletas && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-2"><AlbumIcon className="w-4 h-4" />Detalle</span>
                      <span onClick={() => setDetalleAbierto(it.detalle_galletas)} className="font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-indigo-100">Ver detalle</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TABLA MINICAKES ── */}
      {items.some(it => it.tipo_formulario === "minicake") && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Cake className="w-5 h-5 text-[#6F2521]" />
            Mini Cakes
          </h3>

          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Producto</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Sabor</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Imagen</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(it => it.tipo_formulario === "minicake").map((it, idx) => (
                  <tr key={it.item_id} className={`border-b last:border-0 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {it.producto_imagen && (
                          <img src={it.producto_imagen} alt={it.producto_nombre ?? ""} className="w-14 h-14 object-cover rounded-lg border-2 border-gray-200 flex-shrink-0" />
                        )}
                        <span className="font-medium text-gray-800">{it.producto_nombre ?? "—"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                        <Cake className="w-4 h-4" />{it.sabor_nombre ?? "—"}
                      </span>
                    </td>


                    <td className="p-4">
                      <span
                        onClick={() => { if (!it.ruta_imagen_referencia) return; setImagenAbierta(importarImagenReferenciaPorRuta(it.ruta_imagen_referencia, it.tipo_formulario)); }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${it.ruta_imagen_referencia ? "bg-indigo-50 text-indigo-700 cursor-pointer hover:bg-indigo-100" : "bg-gray-100 text-gray-400"}`}
                      >
                        <Eye className="w-4 h-4" />{it.ruta_imagen_referencia ? "Ver" : "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        onClick={() => { if (!it.detalle_minicake) return; setDetalleAbierto(it.detalle_minicake); }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${it.detalle_minicake ? "bg-indigo-50 text-indigo-700 cursor-pointer hover:bg-indigo-100" : "bg-gray-100 text-gray-400"}`}
                      >
                        <AlbumIcon className="w-4 h-4" />{it.detalle_minicake ? "Ver" : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile - MiniCakes */}
          <div className="lg:hidden space-y-4">
            {items.filter(it => it.tipo_formulario === "minicake").map((it) => (
              <div key={it.item_id} className="bg-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden hover:border-[#6F2521] transition-colors">
                <div className="bg-white p-4 flex items-center gap-3 border-b border-gray-200">
                  {it.producto_imagen && <img src={it.producto_imagen} alt={it.producto_nombre ?? ""} className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 flex-shrink-0" />}
                  <h3 className="font-semibold text-gray-800 text-lg truncate">{it.producto_nombre ?? "—"}</h3>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { icon: <Cake className="w-4 h-4" />,     label: "Sabor",   value: it.sabor_nombre ?? "—",                                                                        bg: "bg-purple-50" },
                  ].map(({ icon, label, value, bg }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-2">{icon}{label}</span>
                      <span className={`font-medium text-gray-800 ${bg} px-3 py-1 rounded-lg text-sm`}>{value}</span>
                    </div>
                  ))}
                  {it.ruta_imagen_referencia && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-2"><Eye className="w-4 h-4" />Imagen</span>
                      <span onClick={() => setImagenAbierta(importarImagenReferenciaPorRuta(it.ruta_imagen_referencia, it.tipo_formulario))} className="font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-indigo-100">Ver imagen</span>
                    </div>
                  )}
                  {it.detalle_minicake && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-2"><AlbumIcon className="w-4 h-4" />Detalle</span>
                      <span onClick={() => setDetalleAbierto(it.detalle_minicake)} className="font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-indigo-100">Ver detalle</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )}
</div>
      </div>

  {imagenAbierta && (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50" onClick={() => setImagenAbierta(null)}>
      <img className="max-w-[80%] max-h-[80%]" src={imagenAbierta} onClick={e => e.stopPropagation()} />
    </div>
  )}

  {detalleAbierto && (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={() => setDetalleAbierto(null)}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Detalles de la torta
          </h3>
          <button
            onClick={() => setDetalleAbierto(null)}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-5 border border-pink-100">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
              {detalleAbierto}
            </p>
          </div>
        </div>

        {/* Footer opcional */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => setDetalleAbierto(null)}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )}

    </div>
  );
}
