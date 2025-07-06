import { Link } from "react-router-dom";
import { useAutenticacion } from "../hooks/useAuth";
import type { Session } from "@supabase/supabase-js";



type LinksProps = {sesion: Session | null}


export const LinksBarraNavegacion = ({ sesion }: LinksProps) => {

    const {cerrarSesion} = useAutenticacion();

    const validarUsuario = sesion?.user;

    return (
    <div className="">
        {!validarUsuario &&(
        <div className="flex list-none gap-12">
            <li className="text-[#6F2521] font-medium hover:text-[#C9A742] transition-colors">
                <Link to={'/inicio'}>Iniciar sesión</Link>
            </li>
            <li className="text-[#6F2521] font-medium hover:text-[#C9A742] transition-colors">
                <Link to={'/registro'}>Registrarse</Link>
            </li>
        </div>
        )}
        {validarUsuario &&(
        <div className="flex list-none gap-12">
            <li className="text-[#6F2521] font-medium hover:text-[#C9A742] transition-colors">
                <Link to={'/'}>Productos</Link>
            </li>
            <li className="text-[#6F2521] font-medium hover:text-[#C9A742] transition-colors">
                <Link to={'/'}>Mis pedidos</Link>
            </li>
            <li>
                <button onClick={cerrarSesion} className="hover:cursor-pointer text-[#6F2521] font-medium hover:text-[#C9A742] transition-colors">Cerrar sesión</button>

            </li>
        </div>
        )}
    </div>
)
}
