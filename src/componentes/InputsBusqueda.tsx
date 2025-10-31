import { Search } from "lucide-react";
import { BotonCarritoDeCompras } from "./BotonCarrito";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const InputsBusqueda = () => {

    const [term, setTerm] = useState("");
    const redirigir = useNavigate();

    const presionaEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter"){
            const busqueda = term.trim();
            if(!busqueda) return;
            redirigir(`/producto?busqueda=${encodeURIComponent(busqueda)}`)
        }
    };

return (
    <div className="lg:flex lg:flex-1 lg:justify-end lg:mr-8 xl:mr-16 max-sm:hidden sm:hidden gap-8">

        <div className="flex ml-10">
            <BotonCarritoDeCompras/>
        </div>

        <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={presionaEnter}
        placeholder="Buscar..."
        className="bg-[#FDDEE8] border outline-none border-gray-300 text-sm rounded-full block w-72 p-2.5 focus:ring-[#C9A742] focus:border-[#C9A742]"
        />
    </div>
)
}

export const InputsBusquedaMovil = () => {
    return (
    <div className="w-full flex justify-center lg:hidden mt-3 mb-3 px-4">
        <div className="flex items-center bg-[#FDDEE8] border border-gray-300 rounded-full focus-within:ring-[#C9A742] focus-within:border-[#C9A742] w-full ">
            <input
            type="text"
            placeholder="Buscar..."
            className="text-sm rounded-l-full w-full px-4 py-2 outline-none bg-transparent"
            />
            <button className="px-4 text-[#6F2521]">
            <Search className="w-4 h-4" />
            </button>
        </div>
    </div>
    );
};
