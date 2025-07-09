import { Search, X } from "lucide-react";

interface PropsBotonBusquedaProducto {

    estado : boolean;
    cambiarEstado: () => void;
}


export const BotonBusquedaProducto = ({estado, cambiarEstado}: PropsBotonBusquedaProducto) => {
    return (
        <button onClick={cambiarEstado} className="lg:hidden text-[#6F2521]"> {estado ? <X size={24} /> : <Search size={24} />} </button>
    )
}
