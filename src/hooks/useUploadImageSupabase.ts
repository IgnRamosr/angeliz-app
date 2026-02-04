import type { UID } from "../assets/types-interfaces/types";
import { supabase } from "../supabase/supabaseClient";
import imageCompression from 'browser-image-compression'

// Función para comprimir imagen antes de subirla a storage
export async function comprimirImagen(archivo: File) {

    const configuracion = {
        maxSizeMB: 0.6,           // tamaño máximo (ajústalo)
        maxWidthOrHeight: 1600,   // límite de resolución
        useWebWorker: true,
        initialQuality: 0.8,      // calidad inicial
    };


    try {
        const imagenComprimida = imageCompression(archivo, configuracion);
        return imagenComprimida;
    } catch (error) {
        console.error("Error al comprimir imagen:", error);
        throw error;
    }

}


// Función para subir imagen de pedido personalizado, solo para guardar la imagen del producto
// al momento de guardar el producto en el carrito
export async function subirImagenReferenciaSupabase(archivo: File, userId: string | undefined) {

    const limpiarNombreArchivo = archivo.name.split('.').pop();
    const nombreArchivo = `${crypto.randomUUID()}.${limpiarNombreArchivo}`
    const rutaArchivo = `${userId}/${nombreArchivo}`;

    const {error} = await supabase.storage.from('referencia_torta_personalizada').upload(rutaArchivo, archivo,{cacheControl: '3600',upsert:false,contentType: archivo.type})
    if (error) throw error;

    return rutaArchivo;

}


export async function eliminarImagenReferenciaSupabase(uid: UID) {

    const {data, error: errorConsulta} = await supabase.from('carrito_items').select('ruta_imagen_referencia').eq("uid",uid).single();

    if (data?.ruta_imagen_referencia === null || data?.ruta_imagen_referencia === undefined) return;

    if (errorConsulta) throw errorConsulta;


    const {error} = await supabase.storage.from('referencia_torta_personalizada').remove([data.ruta_imagen_referencia])
    if (error) throw error;

}


export function importarImagenReferenciaPorRuta(rutaImagenReferencia: string) {

    const {data} = supabase.storage.from('referencia_torta_personalizada').getPublicUrl(rutaImagenReferencia);

    return data.publicUrl;
}
