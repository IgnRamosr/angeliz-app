import { FormularioRegistro } from "../componentes/FormularioRegistro"
const background = new URL('../assets/imagenes/bg-registro3.jpg', import.meta.url).href;


export const Registro = () => {
  return (
    <>
    <div className="relative min-h-screen w-full">
        <img src={background} alt="" className="absolute inset-0 w-full h-full object-cover"/>
      <div className="absolute  h-full w-full md:w-[500px] bg-white shadow-lg flex items-center justify-center">
        <FormularioRegistro/>
      </div>
    </div>
    </>
  )
}
