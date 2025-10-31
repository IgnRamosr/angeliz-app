import { useState } from "react";
import useUserSession from "../hooks/useUserSession"
import { BarraLateral } from "./BarraLateral";
import { BotonBarraLateral } from "./BotonBarraLateral";
import { BotonCarritoDeCompras } from "./BotonCarrito";
import { LinksBarraNavegacion } from "./LinksBarraNavegacion";
import { InputsBusqueda, InputsBusquedaMovil } from "./InputsBusqueda";
import { useNavigate } from "react-router-dom";
const logo = new URL('../assets/imagenes/logo.png', import.meta.url).href

export const BarraNavegacion = () => {

    const sesion = useUserSession();

    const [abrir, setAbrir] = useState(false);

    const cerrar = () => setAbrir((o: boolean) => !o);

    const redirigir = useNavigate();


return (
    <header className="bg-[#fff0f5] max-sm:h-40 sm:h-40  lg:h-26 w-full  flex flex-wrap items-center ">
      {/*LINKS DE NAVEGACIÓN*/}
      <nav className="max-sm:hidden sm:hidden lg:flex lg:flex-1 lg:justify-start lg:ml-8 xl:ml-16 lg:text-sm xl:text-lg">
        <LinksBarraNavegacion sesion={sesion} columna={false} />
      </nav>

      {/*BOTÓN BARRA LATERAL*/}

      <nav className="max-sm:ml-8 sm:ml-10 max-lg:flex max-lg:flex-1 max-lg:justify-start">
        <BotonBarraLateral estado={abrir} cambiarEstado={cerrar}></BotonBarraLateral>
      </nav>

      {/*BARRA LATERAL*/}

      <BarraLateral estado={abrir} cambiarEstado={cerrar}></BarraLateral>

      {/*LOGO ANGELIZ*/}

      <div className="flex-none" onClick={() => {redirigir("/")}}>
        <img
          src={logo}
          alt="Logo Angeliz"
          className="max-sm:w-52 sm:w-64 lg:w-55 object-contain hover:cursor-pointer"
        />
      </div>

      {/*BOTÓN CARRITO DE COMPRAS MÓVIL, EL WEB SE ENCUENTRA DENTRO DEL COMPONENTE INPUTBUSQUEDA*/}

      <div className="max-sm:mr-8 sm:mr-10 max-lg:flex max-lg:flex-1 max-lg:justify-end lg:hidden">
        <BotonCarritoDeCompras/>
      </div>


      {/*INPUTS DE BUSQUEDA WEB Y MOVIL*/}

      <InputsBusqueda/>

      <InputsBusquedaMovil/>

    </header>
)
}
