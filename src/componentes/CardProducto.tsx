import { useNavigate } from "react-router-dom"
import type {Card} from "../assets/types-interfaces/types"



export const CardProducto = ({id, nombre, precio, imagenURL}: Card) => {

    const redirigir = useNavigate();
    const regidigirAproducto = (id: number) => () => redirigir(`/producto/${id}`);

return (
    <div 
        className="group w-full max-w-xs cursor-pointer transform transition-all duration-300 hover:scale-105" 
        onClick={regidigirAproducto(id)}
    >
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl">
            <div className="relative overflow-hidden aspect-square">
                <img 
                    src={imagenURL} 
                    alt={nombre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="p-4">
                <h2 className="text-lg font-bold text-[#f57fa6] text-center group-hover:text-[#fd4280] transition-colors duration-300">
                    {nombre}
                </h2>
                {/* <p className="text-xl text-pink-600 font-bold mt-2 text-center">${precio}</p> */}
            </div>
        </div>
    </div>
)
}