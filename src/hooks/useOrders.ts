//Funciones para traer los pedidos y detalle de pedidos de los usuarios


import type { EstadoPedido, PedidoConItems } from "../assets/types-interfaces/types";
import { supabase } from "../supabase/supabaseClient";




export async function listarPedidosUsuario(): Promise<PedidoConItems[]>{
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) throw new Error ("Usuario no autenticado");


const {data, error} = await supabase.from("pedidos")
    .select(`
        id,
        usuario_id,
        fecha_solicitud,
        estado,
        metodo_envio, 
        hora_retiro, 
        fecha_entrega,
        items_pedido(
            id, producto_id, subtotal,
            nombre:productos(nombre),
            formulario_torta(id, item_pedido_id, tamano:tamano_producto(tamano), sabor_nombre:sabores(nombre), agregar_nombre_edad, ruta_imagen_referencia, detalle),
            formulario_galletas(id, item_pedido_id, cantidad, ruta_imagen_referencia, detalle),
            formulario_minicake(id, item_pedido_id, sabor_nombre:sabores(nombre), ruta_imagen_referencia, detalle)
        )
    `)
    .eq("usuario_id", user.id)
    .order("fecha_solicitud", { ascending: false });

    if(error) throw error;

    return (data ?? []) as unknown as PedidoConItems[];
};


export async function listarPedidosResumenAdmin(): Promise<any[]> {
    const { data, error } = await supabase
        .from("pedidos_con_contacto")
        .select("*")
        .order("fecha_solicitud", { ascending: false });

    if (error) throw error;
    return (data ?? []);
}

export async function obtenerPedidoDetalleAdmin(pedidoId: number) {
const { data, error } = await supabase
    .from("pedido_detalle_admin")
    .select("*")
    .eq("pedido_id", pedidoId)
    .order("item_id", { ascending: true });

if (error) throw error;

const filas = (data ?? []);

// Cabecera (misma en todas las filas)
const cabecera = filas[0]
    ? {
        pedido_id: filas[0].pedido_id,
        fecha_solicitud: filas[0].fecha_solicitud,
        cliente_nombre: filas[0].cliente_nombre,
        cliente_apellido: filas[0].cliente_apellido,
        cliente_telefono: filas[0].cliente_telefono,
        cliente_email: filas[0].cliente_email,
        estado: filas[0].estado as EstadoPedido | null,
        metodo_envio: filas[0].pedido_metodo_envio,
        hora_retiro: filas[0].pedido_hora_retiro,
        fecha_entrega: filas[0].pedido_fecha_entrega,
    }
    : null;


// Ítems (si no hay ítems, queda arreglo vacío)
const items = filas
    .filter(f => f.item_id !== null)
    .map(f => ({
    item_id: f.item_id!,
    cantidad : f.cantidad,
    tipo_formulario: f.tipo_formulario,
    producto_id: f.producto_id,
    producto_nombre: f.producto_nombre,
    producto_imagen: f.producto_imagen,
    tamano_personas: f.tamano_personas,
    sabor_nombre: f.sabor_nombre,
    agregar_nombre_edad: f.agregar_nombre_edad,
    ruta_imagen_referencia: f.ruta_imagen_referencia,
    detalle: f.detalle,
    detalle_galletas: f.detalle_galletas,
    detalle_minicake: f.detalle_minicake,
    }));

return { cabecera, items };
}

export async function actualizarEstadoPedido(pedidoId: number, nuevoEstado: EstadoPedido): Promise<void> {
    const { error } = await supabase
        .from("pedidos")
        .update({ estado: nuevoEstado })
        .eq("id", pedidoId);

    if (error) throw error;
}