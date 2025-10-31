import useUserSession from "./useUserSession";
import { supabase } from "../supabase/supabaseClient";
import type {CarritoItem, UID} from "../assets/types-interfaces/types"


export const useCartFunctions = () => {

    const sesion = useUserSession();

    const agregarProductoCarrito = async ({uid,nombre_producto, fecha_entrega, sabor_nombre, agregaNombreEdad, tamano, metodo_envio, imagen_url, producto_id:id, sabor_id, tamano_id , tipo_formulario}: CarritoItem) => {

        if (!sesion) throw new Error("Debes iniciar sesión");

        const {data,error} = await supabase
        .from("carrito_items")
        .insert({uid,user_id: sesion.user.id, nombre_producto, tamano, fecha_entrega, sabor_nombre, agrega_nombre_edad: agregaNombreEdad, metodo_envio, imagen_url, producto_id:id, sabor_id, tamano_id, tipo_formulario })
        .single();

        if(error)throw error;
        return data;
    }

    const eliminarProductoCarrito = async (uid: UID) => {
        const {error} = await supabase
        .from("carrito_items")
        .delete()
        .eq("uid",uid);

        if(error) throw error;
    }

    const actualizarProductoCarrito = async ({uid,nombre_producto, fecha_entrega, sabor_nombre, agregaNombreEdad, tamano, metodo_envio, imagen_url, producto_id:id, sabor_id, tamano_id, tipo_formulario}: CarritoItem) => {


        if (!sesion) throw new Error("Debes iniciar sesión");

        const{error} = await supabase
        .from("carrito_items")
        .update({uid, nombre_producto, tamano, fecha_entrega, sabor_nombre, agrega_nombre_edad: agregaNombreEdad, metodo_envio, imagen_url, producto_id:id, sabor_id, tamano_id, tipo_formulario })
        .eq("uid", uid)
        .eq("user_id",sesion.user.id);

        if(error) throw error;
    }

    const listarProductosCarrito = async () => {

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return [];

        const {data, error} = await supabase
        .from("carrito_items")

        .select(`uid, nombre_producto, tamano, fecha_entrega, sabor_nombre, agregaNombreEdad:agrega_nombre_edad, metodo_envio, imagen_url, producto_id, sabor_id,tamano_id, tipo_formulario `)

        .eq("user_id",user.id)
        .order('created_at', { ascending: false });

        if(error) throw error;
        return data ?? [];
    }

    const  vaciarProductosCarrito = async () => {

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return [];

        const {data, error} = await supabase
        .from("carrito_items")

        .delete()

        .eq("user_id",user.id)

        if(error) throw error;
        return data ?? [];
    }

    return {
        agregarProductoCarrito,
        eliminarProductoCarrito,
        actualizarProductoCarrito,
        listarProductosCarrito,
        vaciarProductosCarrito
};

}
