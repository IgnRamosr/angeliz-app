import {createContext, useContext, useEffect, useReducer, type ReactNode} from "react";

import type {FuncionesCarrito} from "../assets/types-interfaces/interfaces"
import type {EstadoCarrito} from "../assets/types-interfaces/interfaces"
import type {CarritoItem} from "../assets/types-interfaces/types"

const CarritoGlobal = createContext<FuncionesCarrito>({} as FuncionesCarrito);


const localSt_Key = "angeliz_cart_items";

const estadoInicial: EstadoCarrito ={
items: [],
CantidadItems: 0,
}

export const ProveedorFuncionesCarrito  = ({children}:{children: ReactNode}) => {

    type acciones =
    |{tipo:'agregar_item'; parametro: CarritoItem}
    |{tipo:'eliminar_item'; parametro: string}
    |{tipo:'actualizar_item'; parametro: CarritoItem}
    |{tipo:'vaciar_carrito';}

    function carritoFunciones(estado: EstadoCarrito, accion:acciones): EstadoCarrito{
        switch (accion.tipo) {
            case 'agregar_item':{
                const nuevosItem = [...estado.items, accion.parametro];
                return{...estado, items:nuevosItem, CantidadItems: nuevosItem.length};
            }

            case 'eliminar_item':{
                const itemfiltrado = estado.items.filter(item => item.uid !== accion.parametro);
                return{...estado, items:itemfiltrado, CantidadItems: itemfiltrado.length};
            }

            case 'actualizar_item':{
                const itemActualizado = estado.items.map(item => item.uid === accion.parametro.uid ? {
                    ...item,
                    uid: accion.parametro.uid,
                    user_id: accion.parametro.user_id,
                    nombre_producto: accion.parametro.nombre_producto,
                    tamano: accion.parametro.tamano,
                    fecha_entrega: accion.parametro.fecha_entrega,
                    sabor_nombre: accion.parametro.sabor_nombre,
                    agregaNombreEdad:accion.parametro.agregaNombreEdad,
                    metodo_envio: accion.parametro.metodo_envio,
                    imagen_url: accion.parametro.imagen_url,
                    producto_id: accion.parametro.producto_id,
                    sabor_id: accion.parametro.sabor_id} : item)
                return{...estado, items:itemActualizado, CantidadItems: itemActualizado.length}; 
            }

            case 'vaciar_carrito':{
                return {items: [], CantidadItems: 0};
            }

            default:
                return estado;
        }
    }

    const [estado, dispatch] = useReducer(carritoFunciones, estadoInicial, (valorInicial) =>{
        const textoGuardado = localStorage.getItem(localSt_Key);
        if (!textoGuardado) return valorInicial;
        const itemsGuardados: CarritoItem[] = JSON.parse(textoGuardado);
        return {
            items: Array.isArray(itemsGuardados) ? itemsGuardados : [],
            CantidadItems: Array.isArray(itemsGuardados) ? itemsGuardados.length : 0,
        };
    } )

    const agregarItem    = (item: CarritoItem) => dispatch({ tipo: 'agregar_item', parametro: item });
    const eliminarItem   = (uid: string) => dispatch({ tipo: 'eliminar_item', parametro: uid });
    const actualizarItem = (item: CarritoItem) => dispatch({ tipo: 'actualizar_item', parametro: item });
    const vaciarCarrito  = () => dispatch({ tipo: 'vaciar_carrito' });

    useEffect(() => {
        localStorage.setItem(localSt_Key, JSON.stringify(estado.items))
    }, [estado.items])
    

return(
    <CarritoGlobal.Provider value={{
        items: estado.items,
        CantidadItems: estado.CantidadItems,
        agregarItem,
        eliminarItem,
        actualizarItem,
        vaciarCarrito,
        }}>{children}</CarritoGlobal.Provider>
);
};

export const useCart = () => useContext(CarritoGlobal);

