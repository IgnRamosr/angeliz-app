import { Menu, X } from "lucide-react";

interface PropsBotonBarraLat {

    estado : boolean;
    cambiarEstado: () => void;
}


export const BotonBarraLateral = ({estado, cambiarEstado}: PropsBotonBarraLat) => {
    return (
        <button onClick={cambiarEstado} className="lg:hidden text-[#6F2521]"> {estado ? <X size={24}  className="fixed right-6 top-2 bg-[#fcd254] rounded-full "/> : <Menu size={24} />} </button>
    )
}
