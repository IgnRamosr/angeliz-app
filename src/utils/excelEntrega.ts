    // src/utils/excelEntrega.ts
    import * as XLSX from "xlsx";

    export type FilaEntregaExcel = {
    pedidoId: number;
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

    export function descargarExcelEntrega(filas: FilaEntregaExcel[], nombreArchivo = "pedidos-delivery.xlsx") {
    const datos = filas.map((f) => ({
        "N° Pedido": f.pedidoId,
        Nombre: f.nombre ?? "",
        Teléfono: f.telefono ?? "",
        Dirección: f.direccion ?? "",
        Comuna: f.comuna ?? "",
        "Calle referencia": f.calleReferencia ?? "",
        "Depto o Casa": f.deptoOCasa ?? "",
        Observación: f.observacion ?? "",
        "¿Recibe el titular?": f.recibePedidoTitular === false ? "No" : "Sí",
        "Nombre receptor": f.recibePedidoTitular === false ? (f.receptorNombre ?? "") : "",
        "Apellido receptor": f.recibePedidoTitular === false ? (f.receptorApellido ?? "") : "",
        "Teléfono receptor": f.recibePedidoTitular === false ? (f.receptorTelefono ?? "") : "",
    }));

    const hoja = XLSX.utils.json_to_sheet(datos);
    hoja["!cols"] = [
        { wch: 10 }, { wch: 22 }, { wch: 16 }, { wch: 28 }, { wch: 16 },
        { wch: 28 }, { wch: 14 }, { wch: 40 }, { wch: 16 }, { wch: 20 }, { wch: 20 }, { wch: 18 },
    ];

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Pedidos Delivery");

    XLSX.writeFile(libro, nombreArchivo);
    }