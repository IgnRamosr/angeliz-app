import type { CarritoItem } from "./types";

export interface PropsBarraLateral {
    estado: boolean;
    cambiarEstado: () => void;
}

export interface Imagen{
    url: string;
    es_principal: boolean; 
}

export interface SaborRelacionado {
    sabor_id: number;
    sabores: { sabor_id: number; nombre: string };
}

export interface TamanoRelacionado {
    tamano: number ,
    tamano_id: number; 
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio_base: number;
    tipo_formulario: string;
    subcategoria_id: number | null;
    imagenes_producto?: Imagen[];
    tamano_producto: TamanoRelacionado[];
    sabor_producto: SaborRelacionado[];
}


export interface ParametrosAutenticacion{
    email: string
    password: string
}

export interface ProfileData{
    id: string
    nombre: string
    apellido: string
    telefono: string
}

export interface PropsBotonBarraLat {

    estado : boolean;
    cambiarEstado: () => void;
}

export interface EstadoCarrito {
    items: CarritoItem[];
    CantidadItems: number;
}

export interface FuncionesCarrito extends EstadoCarrito{
    agregarItem: (item: CarritoItem) => void;
    eliminarItem: (uid: string) => void;
    actualizarItem: (item: CarritoItem) => void;
    vaciarCarrito: () => void;
}

export interface datosFormContacto {
nombre: string;
apellido: string;
telefono: string;
email: string;
crearCuenta: boolean;
password: string;
}