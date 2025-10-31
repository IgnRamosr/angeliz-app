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