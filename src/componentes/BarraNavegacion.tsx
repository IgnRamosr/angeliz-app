// import {UserCircleIcon} from "lucide-react"
import useUserSession from "../hooks/useUserSession"
import { BotonBarraLateral } from "./BotonBarraLateral";
import { BotonBusquedaProducto } from "./BotonBusquedaProducto";
import { LinksBarraNavegacion } from "./LinksBarraNavegacion";
const logo = new URL('../assets/imagenes/logo.png', import.meta.url).href

export const BarraNavegacion = () => {

    const sesion = useUserSession();


return (
    <header className="bg-[#fff0f5]  h-26 w-full  flex items-center ">

      {/* <UserCircleIcon className="absolute text-[#6F2521] left-28 w-16 h-12 cursor-pointer red"/> */}

      <nav className="lg:flex lg:flex-1 lg:justify-start lg:ml-8 xl:ml-16 lg:text-sm xl:text-lg">
        <LinksBarraNavegacion sesion={sesion} />
      </nav>

      <nav className="max-lg:flex max-lg:flex-1 max-lg:justify-start max-sm:ml-8 sm:ml-10">
        <BotonBarraLateral estado={false} cambiarEstado={function (): void {
        throw new Error("Function not implemented.");
      } }></BotonBarraLateral>
      </nav>

      <div className="flex-none">
        <img
          src={logo}
          alt="Logo Angeliz"
          className="max-sm:w-52 sm:w-60 lg:w-68 object-contain"
        />
      </div>

      <div className="max-lg:flex max-lg:flex-1 max-lg:justify-end max-sm:mr-8 sm:mr-10"> 
        <BotonBusquedaProducto estado={false} cambiarEstado={function (): void {
        throw new Error("Function not implemented.");
      } }></BotonBusquedaProducto>
      </div>

      <div className="lg:flex lg:flex-1 lg:justify-end lg:mr-8 xl:mr-16 max-sm:hidden sm:hidden">
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-[#FDDEE8] border outline-none border-gray-300 text-sm rounded-full block w-72 p-2.5 focus:ring-[#C9A742] focus:border-[#C9A742]"
        />
      </div>

    </header>
)
}
