import { Outlet } from "react-router-dom"
import { BarraNavegacion } from "../componentes/Navegacion/BarraNavegacion"
// import { PiePagina } from "../componentes/PiePagina"

export const MenuPrincipal = () => {


  return (
    <div className="flex flex-col min-h-screen">
    <BarraNavegacion/>
    <main className="flex-grow">
      <Outlet/>
    </main>
    {/* <PiePagina/> */}
    </div>
  )
}
