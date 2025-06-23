import { FormularioRegistro } from "../componentes/FormularioRegistro"
const background = new URL('../assets/imagenes/bg-registro3.jpg', import.meta.url).href;


export const Registro = () => {
  return (
    <>
    <div className="relative min-h-screen w-full">
    <img
        src={background}
        alt="Fondo repostería"
        className="absolute inset-0 w-full h-full object-cover"
/>
      <div className="relative z-10 flex justify-start items-center min-h-screen w-full">
        <div className="w-full md:w-[500px] bg-white shadow-lg h-full flex items-center justify-center">
          <FormularioRegistro/>
        </div>
      </div>
    </div>
    </>
  )
}
