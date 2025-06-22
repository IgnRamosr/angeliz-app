import { FormularioLogin } from "../componentes/FormularioLogin";
const background = new URL('../assets/imagenes/bg5.jpg', import.meta.url).href;

export const Login = () => (

<div className="relative min-h-screen w-full">
    {/* Imagen de fondo */}
    <img
        src={background}
        alt="Fondo repostería"
        className="absolute inset-0 w-full h-full object-cover"
/>

    <div className="relative z-10 flex justify-end items-center min-h-screen w-full">
        <div className="w-full md:w-[500px] bg-white shadow-lg h-full flex items-center justify-center">
        <FormularioLogin />
        </div>
    </div>
</div>
)
