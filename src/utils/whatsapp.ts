import { supabase } from "../supabase/supabaseClient";

/* =========================
 *  Helpers de formato
 * ========================= */
export function fmtFecha(iso?: string | null) {
  if (!iso) return "—";
  const utcString = /Z|[+-]\d{2}:\d{2}$/.test(iso) ? iso : iso + "Z";
  const d = new Date(utcString);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Santiago" });
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
    tipo_formulario?: string | null;
    tamano?: number | null;
    cantidad?: number | null;
    sabor_nombre?: string | null;
    fecha_entrega?: string | null;
    metodo_envio?: string | null;
    detalle?: string | null;
    ruta_imagen_referencia?: string | null;
    hora_retiro?: string | null;
    agregar_nombre_edad?: boolean | null;
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
*
        `)
        .eq("pedido_id", pedidoId);

    if (error) { console.error("Error cargando detalle:", error.message); return []; }

    return (data ?? []).map((r: any) => ({
        nombre_producto:        r.producto_nombre                                        ?? "Producto",
        tipo_formulario:        r.tipo_formulario                                        ?? null,
        tamano:                 r.tamano_personas                                        ?? null,
        cantidad:               r.cantidad                                               ?? null,
        sabor_nombre:           r.sabor_nombre                                           ?? null,
        fecha_entrega:          r.fecha_entrega                                          ?? null,
        metodo_envio:           r.metodo_envio                                           ?? null,
        detalle:                r.detalle ?? r.detalle_galletas ?? r.detalle_minicake    ?? null,
        ruta_imagen_referencia: r.ruta_imagen_referencia                                 ?? null,
        hora_retiro:            r.hora_retiro                                            ?? null,
    }));
}



export function buildWhatsAppHrefFromPedido(p: PedidoDetalleParaWA) {
    const phone = toE164CL(p.contacto_telefono);
    if (!phone) return null;

    const fechaSolicitud = p.fecha_solicitud
        ? new Date(/Z|[+-]\d{2}:\d{2}$/.test(p.fecha_solicitud) ? p.fecha_solicitud : p.fecha_solicitud + "Z").toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Santiago" })
        : "—";

    const nombreCliente = [p.contacto_nombre, p.contacto_apellido]
        .filter(Boolean).join(" ").trim();

    const separador = "\n————————————\n";

    const lineas = p.items.map((it, i) => {

        const nombreProducto = it.nombre_producto ?? "Producto";
        const tipo           = it.tipo_formulario ?? "";
        const esCrea         = nombreProducto.toLowerCase().includes("crea");
        const esMini         = tipo === "minicake" || nombreProducto.toLowerCase().includes("minicake");
        const fechaEnt       = it.fecha_entrega
            ? (() => { const [y,m,d] = it.fecha_entrega!.split("T")[0].split("-").map(Number); return new Date(y, m-1, d).toLocaleDateString("es-CL"); })()
            : "—";

        const partes: string[] = [`*${i + 1}. ${nombreProducto}*`];

        if (tipo === "torta" && it.tamano)
            partes.push(`\u{1F465} ${it.tamano} ${it.tamano === 1 ? "persona" : "personas"}`);

        if (tipo === "galletas" && it.cantidad)
            partes.push(`\u{1F36A} Cantidad: ${it.cantidad} unid.`);

        if ((tipo === "torta" || esMini) && it.sabor_nombre)
            partes.push(`\u{1F382} Sabor: ${it.sabor_nombre}`);

            partes.push(`\u{1F4C5} Entrega: ${fechaEnt}`);

        if (it.metodo_envio)
            partes.push(`\u{1F69A} Envío: ${it.metodo_envio}`);

        if (it.hora_retiro)
            partes.push(`\u{1F55B} Hora retiro: ${it.hora_retiro}`);

        if (tipo === "torta" && it.agregar_nombre_edad !== null && !esCrea && !esMini)
            partes.push(`\u{1F464} Agrega Nombre/Edad: ${it.agregar_nombre_edad ? "Sí" : "No"}`);

        if ((tipo === "torta" || esCrea || esMini) && it.detalle)
            partes.push(`\u{1F4DD} Detalle: ${it.detalle}`);

        if ((tipo === "torta" || esCrea || esMini) && it.ruta_imagen_referencia)
            partes.push(`\u{1F5BC} _(incluye imagen de referencia)_`);

        return partes.join("\n");
    });

    const header =
        `Hola${nombreCliente ? ` ${nombreCliente}` : ""} \u{1F44B}\n` +
        `Te contactamos de *Angeliz* por tu *pedido #${p.id}*.\n` +
        `\u{1F550} Solicitud: ${fechaSolicitud}\n`;

    const cuerpo =
        `\n*\u{1F4E6} Detalle de tu pedido:*\n` +
        separador +
        lineas.join(separador) +
        separador;

    const footer = `\u00BFConfirmamos tu pedido o necesitas ajustar algo? \u{1F60A}`;

    let texto = `${header}${cuerpo}${footer}`;
    if (texto.length > 3800) {
        texto = `${header}${cuerpo.slice(0, 3700)}…\n${footer}`;
    }


    return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(texto)}`;
}

export function openWhatsApp(href: string | null) {
  if (!href) return;
  window.open(href, "_blank", "noopener,noreferrer");
}
