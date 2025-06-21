// import { Link } from "react-router-dom"
import {UserCircleIcon} from "lucide-react"
const logo = new URL('../assets/imagenes/logo.png', import.meta.url).href

export const BarraNavegacion = () => {
return (
    <header className="relative bg-[#fff0f5] top-0 left-0 h-26 w-full  flex items-center justify-center">

      <UserCircleIcon className="absolute text-[#6F2521] left-28 w-16 h-12 cursor-pointer red"/>

      <img src={logo} alt="Logo-Angeliz" className=" w-68 object-contain" /> 

      <div className="absolute right-36 flex items-center">

        <input type="text" placeholder="Buscar..." className="flex justify-center w-80 bg-[#FDDEE8] outline-none focus:border-2 focus:ring focus:ring-[#6F2521] focus:border-[#6F2521] px-4 py-2 rounded-full" />

      </div>

    </header>
)
}
