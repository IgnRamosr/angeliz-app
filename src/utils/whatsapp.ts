import { supabase } from "../supabase/supabaseClient";

/* =========================
 *  Helpers de formato
 * ========================= */
export function fmtFecha(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" });
}

/** Normaliza a E.164 para Chile (56…) y deja sólo dígitos.
 * Casos:
 *  - "+56 9 6493 4531"  -> "56964934531"
 *  - "9 6493 4531"      -> "56964934531"
 *  - "964934531"        -> "56964934531"
 *  - "022345678" (fijo) -> "5622345678"
 */
export function toE164CL(raw?: string | null): string | null {
  if (!raw) return null;
  let digits = (raw + "").replace(/[^\d]/g, "");

  // Quitar ceros iniciales redundantes tipo "09..." o "022..."
  if (digits.startsWith("0")) {
    digits = digits.replace(/^0+/, "");
  }

  // Si ya viene con 56
  if (digits.startsWith("56")) return digits;

  // Si viene con 569… o 56… ya habríamos retornado arriba.
  // Si es móvil nacional 9 dígitos (ej: 9xxxxxxxy) -> 56 + 9 dígitos
  if (digits.length === 9) return `56${digits}`;

  // Si es fijo 8 dígitos (ej: 2xxxxxxx) -> 56 + 8 dígitos
  if (digits.length === 8) return `56${digits}`;

  // Si viene con código de área (ej: 22xxxxxxx => 9 dígitos) -> 56 + 9 dígitos
  if (digits.length === 9 && /^[2-9]/.test(digits)) return `56${digits}`;

  // Último recurso: si es > 8 y < 12, anteponemos 56
  if (digits.length >= 8 && digits.length <= 11) return `56${digits}`;

  return null;
}


type ItemDetalle = {
  nombre_producto?: string | null;
  tamano?: number | null;            // personas
  sabor_nombre?: string | null;
  fecha_entrega?: string | null;
  metodo_envio?: string | null;
  // agrega si tienes subtotal, cantidad, etc.
};

type PedidoDetalleParaWA = {
  id: number;
  contacto_nombre?: string | null;
  contacto_apellido?: string | null;
  contacto_telefono?: string | null;
  fecha_solicitud?: string | null;
  items: ItemDetalle[];
};




// + NUEVO: helper para traer ítems del pedido
// utils.ts
export async function fetchItemsPedido(pedidoId: number) {
  const { data, error } = await supabase
    .from("pedido_detalle_admin")
    .select(`
      producto_nombre,
      tamano_personas,
      sabor_nombre,
      fecha_entrega,
      metodo_envio
    `)
    .eq("pedido_id", pedidoId);

  if (error) {
    console.error("Error cargando detalle:", error.message);
    return [];
  }

  // Mapea a los NOMBRES que espera buildWhatsAppHrefFromPedido
  return (data ?? []).map((r: any) => ({
    nombre_producto: r.producto_nombre ?? "Producto",
    tamano: r.tamano_personas ?? null,
    sabor_nombre: r.sabor_nombre ?? null,
    fecha_entrega: r.fecha_entrega ?? null,
    metodo_envio: r.metodo_envio ?? null,
  }));
}



export function buildWhatsAppHrefFromPedido(p: PedidoDetalleParaWA) {
  const phone = toE164CL(p.contacto_telefono);
  if (!phone) return null;

  const fechaSolicitud = p.fecha_solicitud
    ? new Date(p.fecha_solicitud).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" })
    : "—";

  const nombre = [p.contacto_nombre, p.contacto_apellido].filter(Boolean).join(" ").trim();

  // Línea por ítem
  const lineas = p.items.map((it, _i) => {
    const fechaEnt = it.fecha_entrega
      ? new Date(it.fecha_entrega).toLocaleDateString("es-CL")
      : "—";
    const partes: string[] = [];
    if (it.nombre_producto) partes.push(`• ${it.nombre_producto}`);
    if (it.tamano) partes.push(`(${it.tamano} personas.)`);
    if (it.sabor_nombre) partes.push(`Sabor: ${it.sabor_nombre}`);
    partes.push(`Entrega: ${fechaEnt}`);
    if (it.metodo_envio) partes.push(`Envío: ${it.metodo_envio}`);
    return `${partes.join(" — ")}`;
  });

  // Mensaje
  const header = `Hola${nombre ? ` ${nombre}` : ""} \nTe contactamos de *Angeliz* por tu *pedido #${p.id}*.\n`;
  const cuerpo =
    `\n*Fecha de solicitud:* ${fechaSolicitud}\n` +
    `*Detalle:*\n` +
    (lineas.length ? lineas.join("\n") : "—");
  const footer = `\n\n¿Confirmamos o necesitas ajustar algo?`;

  // WhatsApp tiene límite aprox. 4096 chars; truncamos por si acaso
  let texto = `${header}${cuerpo}${footer}`;
  if (texto.length > 3800) {
    texto = `${header}${cuerpo.slice(0, 3700)}…${footer}`;
  }

  const encoded = encodeURIComponent(texto);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function openWhatsApp(href: string | null) {
  if (!href) return;
  window.open(href, "_blank", "noopener,noreferrer");
}
