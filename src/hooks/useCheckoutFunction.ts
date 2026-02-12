//Funciones para interactuar con el carrito

import type { CarritoItem } from "../assets/types-interfaces/types";
import type { datosFormContacto } from '../assets/types-interfaces/interfaces';
import { supabase } from "../supabase/supabaseClient"



export const obtenerUsuario = async () => {
    const {data, error} = await supabase.auth.getUser();
    if(error||!data.user){
        console.error("No hay usuario autenticado");
        return;
    }
    const usuarioId = data.user.id;
    return usuarioId;
}

const esAnonimo = async (): Promise<boolean> => {
    const { data } = await supabase.auth.getUser();
    const u = data.user;
    return !!u && ( (u as any).is_anonymous ?? u?.app_metadata?.provider === "anon" );
};

const guardarContacto = async (userId: string| undefined, c: datosFormContacto) => {
    // Reglas: si crearCuenta => correo y password obligatorios
    if (c.crearCuenta) {
        if (!c.email?.trim() || !c.password?.trim()) {
        throw new Error("Debes ingresar correo y contraseña para crear la cuenta.");
        }
    }

    const fila = {
        nombre: c.nombre?.trim() || null,
        apellido: c.apellido?.trim() || null,
        telefono: c.telefono?.trim() || null,
        correo: c.email?.trim() || null,
        user_id: userId,
    };

    const { data, error } = await supabase.from("contacto").insert(fila).select("id").single();
    if (error) throw new Error(`Error guardando contacto: ${error.message}`);
    return data.id;
};

const promoverCuentaAnonima = async (correo: string, password: string) => {
    // Mantiene el mismo user_id
    const { error } = await supabase.auth.updateUser({
        email: correo,
        password,
    });
    if (error) throw new Error(`No se pudo crear la cuenta: ${error.message}`);
    // La sesión activa sigue siendo la misma (mismo uid), pero ahora ya no es anónima
};


const insertarPedido = async (usuarioId: string | undefined, contactoId: number | null) => {
    const {data, error} = await supabase
    .from("pedidos")
    .insert({usuario_id: usuarioId, fecha_solicitud: new Date().toISOString(), contacto_id:contactoId})
    .select("id").single();

    if(error){
        console.error("Error insertando pedido:", error.message);
    }

    return data!.id;
}


const insertarItemsPedido = async (pedidoID: number, itemsCarrito:CarritoItem[]) => {

    const filas = itemsCarrito.map((item) => ({pedido_id:pedidoID, producto_id:item.producto_id, subtotal:0}));

    const {data, error} = await supabase
    .from("items_pedido")
    .insert(filas)
    .select("id")

    if(error){
        console.error("Error insertando items:", error.message);
    }

    return(data)?.map((item) => item.id);
}

const insertarFormulario = async (itemsCarrito: CarritoItem[], idsItemsPedido: number[]| undefined) => {

    const filas = itemsCarrito
    .map((item, index) => ({item, item_pedido_id: idsItemsPedido?.[index]}))
    .filter(({item, item_pedido_id}) => item!.tipo_formulario == "torta" && !!item_pedido_id)
    .map(({item, item_pedido_id})=>({
    item_pedido_id,tamano_id: item.tamano_id, sabor_id: item.sabor_id, 
    ruta_imagen_referencia: item.ruta_imagen_referencia, detalle_torta: item.detalle_torta, 
    fecha_entrega: item.fecha_entrega, agregar_nombre_edad:item.agregaNombreEdad, 
    metodo_envio: item.metodo_envio
    }));

    const { error } = await supabase.from("formulario_torta").insert(filas);

    if(error){
        console.error("Error insertando items al formulario:", error.message);
    }
}

async function asegurarPerfil(userId: string | undefined) {

    const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId }, { onConflict: "id" });
    if (error) throw new Error(`No se pudo asegurar perfil: ${error.message}, ${error.details}`);
}


export async function generaSolicitud (itemsCarrito: CarritoItem[], contacto?: datosFormContacto) {

    const usuarioID = await obtenerUsuario();

    let contactoId: number | null = null;

        if (await esAnonimo()) {
            await asegurarPerfil(usuarioID);
        if (contacto) {
        contactoId = await guardarContacto(usuarioID, contacto);
        if (contacto.crearCuenta) {
            await promoverCuentaAnonima(contacto.email!, contacto.password!);
        }
        }
    }

    const pedidoID = await insertarPedido(usuarioID,contactoId);

    const idsItems = await insertarItemsPedido(pedidoID, itemsCarrito);

    await insertarFormulario(itemsCarrito, idsItems);

    supabase.functions.invoke("notificar-telegram", {
    body: { pedidoId: pedidoID },
    }).catch((e) => console.warn("No se pudo notificar por Telegram:", e?.message));

    return pedidoID;
}


