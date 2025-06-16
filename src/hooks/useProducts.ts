import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";

interface Imagen{
    url: string;
    es_principal: boolean; 
}

    interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio_base: number;
    tipo_formulario: string;
    subcategoria_id: number | null;
    imagenes_producto?: Imagen[];
}

export const useProducts = () => {

const [productos, setProductos] = useState<Producto[]>([]);

    useEffect(() => {
        const listarProductos = async () =>{
            const {data,error} = await supabase.from('productos').select('*, imagenes_producto(url, es_principal)');

            if(error){
                console.log('Error al obtener los productos', error)
            }else{
                setProductos(data as Producto[]);
            }
        };

    listarProductos();
    }, []);

return { productos };

}