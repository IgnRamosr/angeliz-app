    // src/utils/pdfEntrega.ts
    import jsPDF from "jspdf";

    export type DatosEntregaPdf = {
    nombre?: string | null;
    telefono?: string | null;
    direccion?: string | null;
    comuna?: string | null;
    calleReferencia?: string | null;
    deptoOCasa?: string | null;
    observacion?: string | null;
    recibePedidoTitular?: boolean | null;
    receptorNombre?: string | null;
    receptorApellido?: string | null;
    receptorTelefono?: string | null;
    };

    const ROSADO = "#e94f9e";
    const CAFE = "#6F2521";

    const FUENTE_MINIMA = 5;
    const PROPORCION_ALTURA_LINEA = 1.25;

    async function registrarFuentes(doc: jsPDF) {
    const [{ Anton_Regular }, { AbrilFatface_Regular }, { LeagueSpartan_Bold }, { Allura_Regular }] =
        await Promise.all([
        import("./fonts/Anton_Regular"),
        import("./fonts/AbrilFatface_Regular"),
        import("./fonts/LeagueSpartan_Bold"),
        import("./fonts/Allura_Regular"),
        ]);

    doc.addFileToVFS("Anton-Regular.ttf", Anton_Regular);
    doc.addFont("Anton-Regular.ttf", "Anton", "normal");

    doc.addFileToVFS("AbrilFatface-Regular.ttf", AbrilFatface_Regular);
    doc.addFont("AbrilFatface-Regular.ttf", "AbrilFatface", "normal");

    doc.addFileToVFS("LeagueSpartan-Bold.ttf", LeagueSpartan_Bold);
    doc.addFont("LeagueSpartan-Bold.ttf", "LeagueSpartan", "bold");

    doc.addFileToVFS("Allura-Regular.ttf", Allura_Regular);
    doc.addFont("Allura-Regular.ttf", "Allura", "normal");
    }

    function dibujarImagenCentrada(doc: jsPDF, dataUrl: string, centerX: number, y: number, anchoDeseado: number) {
    const props = doc.getImageProperties(dataUrl);
    const alto = (anchoDeseado * props.height) / props.width;
    doc.addImage(dataUrl, props.fileType, centerX - anchoDeseado / 2, y, anchoDeseado, alto);
    return alto;
    }

    // Arma "Etiqueta: valor" solo si el valor viene con contenido real; si no, retorna null.
    function lineaSiExiste(etiqueta: string, valor?: string | null): string | null {
    if (!valor || !valor.trim()) return null;
    return `${etiqueta}: ${valor.trim()}`;
    }

    type Bloque = { lineas: string[]; espacioAntes: number };

    export async function generarPdfEntrega(datos: DatosEntregaPdf) {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    await registrarFuentes(doc);

    const { instagram } = await import("./imagenes/instagram");
    const { sello_fragil } = await import("./imagenes/sello_fragil");
    const { corazones } = await import("./imagenes/corazones");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 60;
    const marginBottom = 60;
    const centerX = pageWidth / 2;

    // 1) Arma los bloques dinámicos (ya sin los vacíos)
    const bloques: Bloque[] = [
    { lineas: [`Nombre: ${datos.nombre ?? "—"}`, `Telefono: ${datos.telefono ?? "—"}`], espacioAntes: 26 }, // antes 50
    ];

    const agregarSiHayContenido = (lineas: (string | null)[], espacioAntes: number) => {
    const validas = lineas.filter((l): l is string => l !== null);
    if (validas.length) bloques.push({ lineas: validas, espacioAntes });
    };

    agregarSiHayContenido([lineaSiExiste("Dirección", datos.direccion), lineaSiExiste("Comuna", datos.comuna)], 18); // antes 30
    agregarSiHayContenido(
    [lineaSiExiste("Calle referencia", datos.calleReferencia), lineaSiExiste("Depto o Casa", datos.deptoOCasa)],
    18, // antes 30
    );
    agregarSiHayContenido([lineaSiExiste("Observación", datos.observacion)], 18); // antes 30

    if (datos.recibePedidoTitular === false) {
    const nombreReceptor = `${datos.receptorNombre ?? ""} ${datos.receptorApellido ?? ""}`.trim();
    agregarSiHayContenido(
        [lineaSiExiste("Recibe", nombreReceptor), lineaSiExiste("Tel. contacto adicional", datos.receptorTelefono)],
        18, // antes 30
    );
    }

    // 2) Mide cuánta altura ocuparían los bloques a un tamaño de fuente dado
    const medirAlturaBloques = (tamanoFuente: number) => {
    const alturaLinea = tamanoFuente * PROPORCION_ALTURA_LINEA;
    doc.setFont("LeagueSpartan", "bold");
    doc.setFontSize(tamanoFuente);
    let total = 0;
    for (const bloque of bloques) {
        total += bloque.espacioAntes;
        for (const linea of bloque.lineas) {
        const partes = doc.splitTextToSize(linea.toUpperCase(), pageWidth - marginX * 2) as string[];
        total += partes.length * alturaLinea;
        }
    }
    return total;
    };

    // 3) Calcula el espacio fijo disponible (todo lo que NO es contenido dinámico)
    const yInicioContenido = 125; // y tras título (80) + subtítulo (+45)
    const propsSello = doc.getImageProperties(sello_fragil);
    const altoSello = (180 * propsSello.height) / propsSello.width;
    const alturaFooter = 60 + 35 + 40 + altoSello;
    const alturaDisponible = pageHeight - marginBottom - yInicioContenido - alturaFooter;

    // 4) Si a tamaño base no cabe, achica la fuente (con piso de legibilidad) — nunca se agrega una página nueva
const FUENTE_MAXIMA = 25; // no le compite en tamaño al subtítulo "Datos de Entrega"
let tamanoFuenteFinal = FUENTE_MINIMA;
for (let candidato = FUENTE_MAXIMA; candidato >= FUENTE_MINIMA; candidato -= 0.5) {
  if (medirAlturaBloques(candidato) <= alturaDisponible) {
    tamanoFuenteFinal = candidato;
    break;
  }
}
const alturaLineaFinal = tamanoFuenteFinal * PROPORCION_ALTURA_LINEA;

    // 5) Dibuja todo con el tamaño ya calculado
    let y = 80;

    // Título (tamaño fijo, no se achica — es el elemento de marca)
    doc.setFont("Anton", "normal");
    doc.setFontSize(26);
    doc.setTextColor(ROSADO);
    doc.text("GRACIAS POR PREFERIRNOS", centerX, y, { align: "center" });

    // Subtítulo (tamaño fijo)
    y += 45;
    doc.setFont("AbrilFatface", "normal");
    doc.setFontSize(20);
    doc.setTextColor("#000000");
    doc.text("Datos de Entrega", centerX, y, { align: "center" });

    // Bloques dinámicos, con el tamaño de fuente ya calculado (base o achicado)
    doc.setFont("LeagueSpartan", "bold");
    doc.setTextColor("#000000");
    for (const bloque of bloques) {
        y += bloque.espacioAntes;
        doc.setFontSize(tamanoFuenteFinal);
        for (const linea of bloque.lineas) {
        const partes = doc.splitTextToSize(linea.toUpperCase(), pageWidth - marginX * 2) as string[];
        for (const parte of partes) {
            y += alturaLineaFinal;
            doc.text(parte, centerX, y, { align: "center" });
        }
        }
    }

    // Footer: "Es un gusto tenerte como cliente" + corazones (tamaño fijo)
    y += 60;
    doc.setFont("Anton", "normal");
    doc.setFontSize(16);
    doc.setTextColor("#3b4bdb");
    const textoGracias = "Es un gusto tenerte como cliente";
    doc.text(textoGracias, centerX, y, { align: "center" });
    const anchoTexto = doc.getTextWidth(textoGracias);
    dibujarImagenCentrada(doc, corazones, centerX + anchoTexto / 2 + 20, y - 14, 26);

    // "Angeliz.cl" + ícono Instagram (tamaño fijo)
    y += 35;
    doc.setFont("Allura", "normal");
    doc.setFontSize(30);
    doc.setTextColor(CAFE);
    doc.text("Angeliz.cl", centerX, y, { align: "center" });
    const anchoAngeliz = doc.getTextWidth("Angeliz.cl");
    dibujarImagenCentrada(doc, instagram, centerX + anchoAngeliz / 2 + 24, y - 16, 20);

    // Sello FRAGIL
    y += 40;
    dibujarImagenCentrada(doc, sello_fragil, centerX, y, 180);

    return doc;
    }

    export async function descargarPdfEntrega(datos: DatosEntregaPdf, nombreArchivo = "datos-entrega.pdf") {
    const doc = await generarPdfEntrega(datos);
    doc.save(nombreArchivo);
    }