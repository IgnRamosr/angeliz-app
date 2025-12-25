//Funciones para traer los pedidos y detalle de pedidos de los usuarios


import type { PedidoConItems } from "../assets/types-interfaces/types";
import { supabase } from "../supabase/supabaseClient";




export async function listarPedidosUsuario(): Promise<PedidoConItems[]>{
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) throw new Error ("Usuario no autenticado");


    const {data,error} = await supabase.from("pedidos").
    select(`
        id ,usuario_id , fecha_solicitud , 
        items_pedido(id,producto_id,subtotal, 
        nombre:productos(nombre),
        formulario_torta(id, item_pedido_id, tamano:tamano_producto(tamano), sabor_nombre:sabores(nombre),fecha_entrega , agregar_nombre_edad, metodo_envio))`)
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
    }
    : null;

// Ítems (si no hay ítems, queda arreglo vacío)
const items = filas
    .filter(f => f.item_id !== null)
    .map(f => ({
    item_id: f.item_id!,
    producto_id: f.producto_id,
    producto_nombre: f.producto_nombre,
    producto_imagen: f.producto_imagen,
    fecha_entrega: f.fecha_entrega,
    tamano_personas: f.tamano_personas,
    sabor_nombre: f.sabor_nombre,
    agregar_nombre_edad: f.agregar_nombre_edad,
    metodo_envio: f.metodo_envio,
    }));

return { cabecera, items };
}