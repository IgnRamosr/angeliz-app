// import {UserCircleIcon} from "lucide-react"
import useUserSession from "../hooks/useUserSession"
import { LinksBarraNavegacion } from "./LinksBarraNavegacion";
const logo = new URL('../assets/imagenes/logo.png', import.meta.url).href

export const BarraNavegacion = () => {

    const sesion = useUserSession();


return (
    <header className="bg-[#fff0f5]  h-26 w-full  flex items-center">

      {/* <UserCircleIcon className="absolute text-[#6F2521] left-28 w-16 h-12 cursor-pointer red"/> */}

      <nav className="flex flex-1 justify-start ml-4">
        <LinksBarraNavegacion sesion={sesion} />
      </nav>

      <div className="flex-none">
        <img
          src={logo}
          alt="Logo Angeliz"
          className="w-68 object-contain"
        />
      </div>

      <div className="flex flex-1 justify-end mr-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="w-72 bg-[#FDDEE8] px-4 py-2 rounded-full outline-none focus:ring focus:ring-[#C9A742]"
        />
      </div>

    </header>
)
}
