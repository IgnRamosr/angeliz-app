import type { Session } from "@supabase/supabase-js";
import type { Producto } from "./interfaces"

export type Validaciones ={
    [key: string]: {
        regex: RegExp
        mensaje: string
    }
}

export type InputCampo = {
    label: string
    type: string
    id: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    error: string
    min?: number
    max?: number
}

export type InputCampoTelefono = {
    label: string
    value: string
    onChange: (nuevoValor: string) => void
    error: string
}

export type Card = {
    id: number;
    nombre: string;
    precio: number;
    imagenURL: string | undefined;
}

export type Rol = "admin" | "cliente" | null;

export type UID = `${string}-${string}-${string}-${string}-${string}`;

export type LinksProps = {sesion: Session | null, columna: boolean, cerrarAlClickearItem: () => void}

export type PropsFormularioTorta  = Pick<Producto,"id" | "nombre" | "tamano_producto" | "sabor_producto" | "tipo_formulario" | "imagenes_producto">;

export type CarritoItem = {uid: UID; user_id?:string; nombre_producto: string;  tamano:number; fecha_entrega:string; sabor_nombre: string; agregaNombreEdad?:boolean; metodo_envio:string; imagen_url: string; producto_id: number; sabor_id:number; tamano_id: number; tipo_formulario:string; };

export type PedidoConItems = {id: number; usuario_id: string; fecha_solicitud: string; items_pedido: ItemPedido[];
};
export type ItemPedido = { id: number; producto_id: number; nombre:ProductoNombre;  subtotal: number, formulario_torta: FormularioTorta };

export type ProductoNombre = { nombre: string };

export type Tamano = { tamano: number };    

export type Sabor  = { nombre: string };

export type FormularioTorta = {id: number; item_pedido_id: number; tamano: Tamano; sabor_nombre: Sabor; fecha_entrega: string; agregar_nombre_edad: boolean; metodo_envio: string;
};


export type PedidoResumen = {
id: number;
usuario_id: string | null;
fecha_solicitud: string | null;  // ISO
creado_en: string | null;        // ISO (si la agregaste)
contacto_nombre: string | null;
contacto_apellido: string | null;
contacto_telefono: string | null;
};

export type Subcategoria = { id: number; nombre: string, visible: boolean };

export type Grupo = { subcategoria: Subcategoria; productos: Producto[] };


