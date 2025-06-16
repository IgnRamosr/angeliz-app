// import { Link } from "react-router-dom"

const logo = new URL('../assets/imagenes/logo.png', import.meta.url).href

export const BarraNavegacion = () => {
return (
    <header className="bg-amber-50 top-0 left-0 w-full  flex flex-col">

      <div className="h-24 flex items-center justify-center px-6 bg-amber-50">
        <img src={logo} alt="Logo-Angeliz" className=" w-68 object-contain" /> 
      </div>


    </header>
)
}
