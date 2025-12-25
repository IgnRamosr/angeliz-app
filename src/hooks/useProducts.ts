//Funciones para traer los productos


import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import type {Producto} from "../assets/types-interfaces/interfaces"


//Buscar productos
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

//Buscar producto por id
export const useProduct = (id: number) => {
    const [producto, setProducto] = useState<Producto | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const buscarProductoPorId = async () => {
            const {data,error} = await supabase
            .from("productos")
            .select("*, tipo_formulario,  imagenes_producto(url, es_principal), tamano_producto(tamano_id:id,tamano), sabor_producto(sabor_id,sabores(nombre))")
            .order("tamano",{ ascending: true, referencedTable: "tamano_producto"})
            .eq("id",id)
            .single();

            if(error){
                setError('No se pudo obtener el producto');
                setProducto(null);
            }else{
                setError(null);
                setProducto(data as Producto);
            }
        }
        if(id) buscarProductoPorId();
    }, [id])

    return{producto, error}
}

//Buscar productos por nombre
export const useProductSearch = () => {
    const [productos, setProductos] = useState<Producto[] | null>([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const buscar = useCallback(
        async (termino: string) => {
            const busqueda = termino.trim();
            if(!busqueda){
                setProductos([]);
                setError(null);
                return;
            }
            setCargando(true);
            setError(null);

            const {data,error} = await supabase
            .from("productos")
            .select("id, nombre, descripcion, precio_base, tipo_formulario, subcategoria_id , imagenes_producto(url, es_principal), tamano_producto(tamano_id:id,tamano), sabor_producto(sabor_id,sabores(nombre))")
            .or(`nombre.ilike.%${busqueda}%,descripcion.ilike.%${busqueda}%`)
            .limit(30);
            setCargando(false);

            if(error){
                setError(error.message ?? 'Error en la busqueda');
                setProductos([]);
                return;
            }
            setProductos((data ?? []) as unknown as Producto[]);
        },
        [],
    )
    return{productos, cargando, error, buscar}
    
}



type Subcategoria = { id: number; nombre: string };

type Grupo = { subcategoria: Subcategoria; productos: Producto[] };

export function useProductosPorSubcategoria(limitPorSubcat = 12) {
const [grupos, setGrupos] = useState<Grupo[]>([]);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
(async () => {
    setCargando(true);
    setError(null);
    // 1) Traer subcategorías visibles/ordenadas (ajusta según tu esquema)
    const { data: subcats, error: e1 } = await supabase
    .from("subcategorias")
    .select("id, nombre")
    .order("nombre", { ascending: true });

    if (e1) { setError(e1.message); setCargando(false); return; }
    if (!subcats?.length) { setGrupos([]); setCargando(false); return; }

    // 2) Para cada subcat, traer productos (con imagen principal)
    const promesas = subcats.map(async (s) => {
    const { data: prods } = await supabase
        .from("productos")
        .select(`
        id, nombre, precio_base,
        imagenes_producto ( url, es_principal )
        `)
        .eq("subcategoria_id", s.id)
        .limit(limitPorSubcat);

    // Normaliza imagen principal al primero (opcional)
    const productos = (prods ?? []).map((p) => {
        const imgs = p.imagenes_producto ?? [];
        const principal = imgs.find(i => i.es_principal) ?? imgs[0];
        return { ...p, imagenes_producto: principal ? [principal] : [] };
    });

    return { subcategoria: s, productos } as Grupo;
    });

    const res = await Promise.all(promesas);
    setGrupos(res);
    setCargando(false);
})();
}, [limitPorSubcat]);

return { grupos, cargando, error };
}
