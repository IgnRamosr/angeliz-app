import { FormularioLogin } from "../componentes/FormularioLogin";
const background = new URL('../assets/imagenes/bg5.jpg', import.meta.url).href;

export const Login = () => (
    <>
    <div className="relative min-h-screen w-full">
        <img src={background} alt="" className="absolute inset-0 w-full h-full object-cover"/>
    </div>
    <div className="absolute right-0 top-0 h-full w-full md:w-[500px] bg-white shadow-lg flex items-center justify-center">
        <FormularioLogin/>
    </div>
    </>
)
