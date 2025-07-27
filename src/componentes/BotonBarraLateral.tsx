import { Menu, X } from "lucide-react";

interface PropsBotonBarraLat {

    estado : boolean;
    cambiarEstado: () => void;
}


export const BotonBarraLateral = ({estado, cambiarEstado}: PropsBotonBarraLat) => {
    return (
        <button onClick={cambiarEstado} className="lg:hidden text-[#6F2521]"> {estado ? <X size={24}  className="max-sm:w-8 max-sm:h-8 sm:w-12 sm:h-12 fixed right-6 top-2 bg-pink-100 rounded-full z-20 "/> : <Menu size={24} className="max-sm:w-7 max-sm:h-7 sm:w-10 sm:h-10 lg:w-8 lg:h-8" />} </button>
    )
}
