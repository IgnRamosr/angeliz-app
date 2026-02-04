// src/componentes/PedidosAdminTabla.tsx
import { usePedidosAdmin } from "../../hooks/usePedidosAdmin";
import type { PedidoResumen } from "../../assets/types-interfaces/types";
import { Link } from "react-router-dom";
import { Calendar, User, Phone, FileText, Loader2, Package, Search, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";

// utils que ya tienes
import { fmtFecha, openWhatsApp, buildWhatsAppHrefFromPedido, fetchItemsPedido } from "../../utils/whatsapp"; 
// ^^^ si tu archivo se llama distinto, ajusta la ruta. IMPORTANTE: que `fetchItemsPedido` esté exportado.

export default function PedidosAdminTabla() {
  const { data, cargando, error } = usePedidosAdmin();

  const [busqueda, setBusqueda] = useState("");
  const [ordenAscendente, setOrdenAscendente] = useState(false);
  const [enviandoWA, setEnviandoWA] = useState<number | null>(null);


const pedidosFiltrados = useMemo(() => {
  if (!data) return [];
  let resultado = [...data];

  if (busqueda.trim()) {
    const terminoBusqueda = busqueda.toLowerCase().trim();
    
    resultado = resultado.filter((p) => {
      // Buscar por ID
      const coincideId = p.id?.toString().includes(terminoBusqueda);
      
      // Buscar por nombre (con validación segura)
      const nombre = (p.contacto_nombre || '').toLowerCase();
      const coincideNombre = nombre.includes(terminoBusqueda);
      
      // Buscar por apellido (con validación segura)
      const apellido = (p.contacto_apellido || '').toLowerCase();
      const coincideApellido = apellido.includes(terminoBusqueda);
      
      // Buscar por teléfono (solo números)
      const telefonoLimpio = (p.contacto_telefono || '').replace(/[^\d]/g, '');
      const busquedaLimpia = terminoBusqueda.replace(/[^\d]/g, '');
      const coincideTelefono = busquedaLimpia && telefonoLimpio.includes(busquedaLimpia);
      
      // Retornar true si coincide con cualquiera de los criterios
      return coincideId || coincideNombre || coincideApellido || coincideTelefono;
    });
  }

  // Ordenar por fecha
  resultado.sort((a, b) => {
    const aTime = new Date(a.fecha_solicitud ?? a.creado_en ?? 0).getTime();
    const bTime = new Date(b.fecha_solicitud ?? b.creado_en ?? 0).getTime();
    return ordenAscendente ? aTime - bTime : bTime - aTime;
  });

  return resultado;
}, [data, busqueda, ordenAscendente]);

  async function handleWhatsApp(p: PedidoResumen) {
    try {
      setEnviandoWA(p.id!);

      // 1) Traemos ítems del pedido
      const rawItems = await fetchItemsPedido(p.id!);

      // 2) Adaptamos a lo que espera el builder (nombre_producto, tamano, sabor_nombre, fecha_entrega, metodo_envio)
      const itemsAdaptados = (rawItems ?? []).map((r: any) => ({
        nombre_producto: r.nombre_producto ?? r.producto_nombre ?? r.nombre ?? "Producto",
        tamano: r.tamano ?? r.tamano_personas ?? null,
        sabor_nombre: r.sabor_nombre ?? r.sabor ?? null,
        fecha_entrega: r.fecha_entrega ?? null,
        metodo_envio: r.metodo_envio ?? null,
      }));

      // 3) Armamos el payload que pide buildWhatsAppHrefFromPedido
      const href = buildWhatsAppHrefFromPedido({
        id: p.id!,
        contacto_nombre: p.contacto_nombre,
        contacto_apellido: p.contacto_apellido,
        contacto_telefono: p.contacto_telefono,
        fecha_solicitud: p.fecha_solicitud ?? p.creado_en,
        items: itemsAdaptados,
      });

      openWhatsApp(href);
    } catch (e) {
      console.error("No se pudo abrir WhatsApp:", e);
    } finally {
      setEnviandoWA(null);
    }
  }

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-12 h-12 text-[#6F2521] animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Cargando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-6 text-center">
        <div className="w-14 h-14 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-red-800 font-bold text-lg">Error al cargar pedidos</p>
        <p className="text-red-600 text-sm mt-2">{error}</p>
      </div>
    );
  }

  // CAMBIO IMPORTANTE: Verificar si NO HAY DATOS EN ABSOLUTO (sin buscar)
  const noHayDatosIniciales = !data || data.length === 0;
  
  if (noHayDatosIniciales) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-12 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-10 h-10 text-gray-500" />
        </div>
        <p className="text-gray-700 font-bold text-xl mb-2">No hay pedidos registrados</p>
        <p className="text-gray-500">Los pedidos aparecerán aquí cuando los clientes realicen solicitudes.</p>
      </div>
    );
  }

  // Si llegamos aquí, HAY datos pero pueden estar filtrados
  const noHayResultados = pedidosFiltrados.length === 0;

  return (
    <div className="space-y-6">
      {/* Toolbar - SIEMPRE SE MUESTRA */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por ID, nombre, apellido o teléfono…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#6F2521] focus:outline-none focus:ring-2 focus:ring-[#6F2521]/20 transition-all"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => setOrdenAscendente((v) => !v)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-[#6F2521] hover:bg-pink-50 transition-all font-semibold text-gray-700 hover:text-[#6F2521]"
        >
          <ArrowUpDown className="w-5 h-5" />
          {ordenAscendente ? "Más antiguos primero" : "Más recientes primero"}
        </button>
      </div>

      {/* Mensaje cuando NO HAY RESULTADOS de la búsqueda */}
      {noHayResultados && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-amber-700" />
          </div>
          <p className="text-amber-900 font-bold text-lg mb-2">No se encontraron resultados</p>
          <p className="text-amber-700 mb-4">
            No hay pedidos que coincidan con "<span className="font-semibold">{busqueda}</span>"
          </p>
          <button
            onClick={() => setBusqueda("")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold"
          >
            Limpiar búsqueda
          </button>
        </div>
      )}

      {/* Cards (mobile) - SOLO SI HAY RESULTADOS */}
      {!noHayResultados && (
        <div className="lg:hidden space-y-4">
          {pedidosFiltrados.map((p) => (
            <div
              key={p.id}
              className="bg-gradient-to-br from-white to-pink-50 border-2 border-gray-200 rounded-xl p-5 shadow-md"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <Link
                  to={`/admin/pedido/${p.id}`}
                  className="inline-flex items-center gap-2 text-[#6F2521] font-bold text-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#6F2521] to-[#8B3330] rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  Pedido #{p.id}
                </Link>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-0.5">Fecha de solicitud</p>
                    <p className="text-sm text-gray-900 font-semibold">
                      {fmtFecha(p.fecha_solicitud ?? p.creado_en)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-0.5">Cliente</p>
                    <p className="text-sm text-gray-900 font-semibold">
                      {p.contacto_nombre ?? "—"} {p.contacto_apellido ?? "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-0.5">Teléfono</p>
                    {p.contacto_telefono ? (
                      <button
                        type="button"
                        onClick={() => handleWhatsApp(p)}
                        disabled={enviandoWA === p.id}
                        className="text-sm text-[#6F2521] font-semibold hover:underline disabled:opacity-60"
                      >
                        {enviandoWA === p.id ? "Abriendo WhatsApp…" : p.contacto_telefono}
                      </button>
                    ) : (
                      <p className="text-sm text-gray-400">—</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <Link
                  to={`/admin/pedido/${p.id}`}
                  className="block w-full bg-gradient-to-r from-[#6F2521] to-[#8B3330] text-white text-center py-2.5 rounded-lg font-semibold"
                >
                  Ver detalles completos
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabla (desktop) - SOLO SI HAY RESULTADOS */}
      {!noHayResultados && (
        <div className="hidden lg:block overflow-hidden rounded-xl border-2 border-gray-200 shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#6F2521]" />
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Nro Pedido</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Fecha Solicitud</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Nombre</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Apellido</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Teléfono</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pedidosFiltrados.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/admin/pedido/${p.id}`}
                        className="inline-flex items-center gap-2 text-[#6F2521] font-bold hover:text-[#8B3330]"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-[#6F2521] to-[#8B3330] rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="underline-offset-2 hover:underline">#{p.id}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700 font-medium">
                        {fmtFecha(p.fecha_solicitud ?? p.creado_en)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 font-semibold">{p.contacto_nombre ?? "—"}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 font-semibold">{p.contacto_apellido ?? "—"}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {p.contacto_telefono ? (
                        <button
                          type="button"
                          onClick={() => handleWhatsApp(p)}
                          disabled={enviandoWA === p.id}
                          className="inline-flex items-center gap-2 text-[#6F2521] font-semibold hover:text-[#8B3330] underline underline-offset-2 disabled:opacity-60"
                        >
                          <Phone className="w-4 h-4" />
                          {enviandoWA === p.id ? "Abriendo WhatsApp…" : p.contacto_telefono}
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}