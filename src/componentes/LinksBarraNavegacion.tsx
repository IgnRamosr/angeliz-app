import { Link } from "react-router-dom";
import { useAutenticacion } from "../hooks/useAuth";
import type {LinksProps} from "../assets/types-interfaces/types"
import { useEffect, useRef, useState } from "react";



export const LinksBarraNavegacion = ({ sesion, columna }: LinksProps) => {

    const {cerrarSesion} = useAutenticacion();
    const [abierto, setAbierto] = useState(false);
    const caja = useRef<HTMLLIElement>(null);

    const validarUsuario = sesion?.user.is_anonymous;

    useEffect(() => {
    const onClick = (e: MouseEvent) => {
        if (!caja.current?.contains(e.target as Node)) setAbierto(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
    }, []);

    const contCls = `flex ${columna ? "flex-col" : "flex-row"} list-none max-sm:gap-10 max-sm:mt-10 max-sm:ml-5 sm:gap-10 sm:mt-20 sm:ml-5 lg:mt-0 lg:gap-8 xl:gap-12`;
    const linkCls = "text-[#6F2521] font-medium hover:text-[#C9A742] transition-colors";

    return (
    <div className="">
        {!validarUsuario &&(
        <div className={`flex ${columna ? 'flex-col' : 'flex-row'} list-none max-sm:gap-10 max-sm:mt-10 max-sm:ml-5 sm:gap-10 sm:mt-20 sm:ml-5 lg:mt-0 lg:gap-8 xl:gap-12`}>
            <li className="text-[#6F2521] font-medium hover:text-[#C9A742] transition-colors">
                <Link to={'/'}>Productos</Link>
            </li>
            <li className="text-[#6F2521] font-medium hover:text-[#C9A742] transition-colors">
                <Link to={'pedidos'}>Mis pedidos</Link>
            </li>
            <li>
                <button onClick={cerrarSesion} className="hover:cursor-pointer text-[#6F2521] font-medium hover:text-[#C9A742] transition-colors">Cerrar sesión</button>
            </li>
        </div>
        )}
        {validarUsuario &&(
        <div className={`flex ${columna ? 'flex-col' : 'flex-row'} list-none max-sm:gap-10 max-sm:mt-10 max-sm:ml-5 sm:gap-10 sm:mt-20 sm:ml-5 lg:mt-0 lg:gap-8 xl:gap-12`}>

            <ul className={contCls}>
            <li className={linkCls}><Link to="/">Productos</Link></li>
            <li className={linkCls}><Link to="/pedidos">Mis pedidos</Link></li>

            {/* Dropdown de "Ingresar" con hover + click */}
            <li ref={caja} className="relative group">
                <button
                onClick={() => setAbierto(v => !v)}
                className="inline-flex items-center gap-2 text-[#6F2521] font-medium hover:text-[#C9A742] transition-colors"

                >
                Ingresar
                <svg width="14" height="14" viewBox="0 0 20 20" className="opacity-70">
                    <path d="M6 8l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                </button>

                <div
                role="menu"
                className={[
                    "absolute  z-30 w-44 rounded-xl border border-black/5 bg-white shadow-lg",
                    "transition-all origin-top-right",
                    // abre por hover o por estado 'abierto'
                    "group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto",
                    abierto ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
                ].join(" ")}
                >
                <Link
                    to="/inicio"
                    role="menuitem"
                    className="block px-4 py-2 text-sm text-[#6F2521] hover:bg-black/5"
                    onClick={() => setAbierto(false)}
                >
                    Iniciar sesión
                </Link>
                <Link
                    to="/registro"
                    role="menuitem"
                    className="block px-4 py-2 text-sm text-[#6F2521] hover:bg-black/5"
                    onClick={() => setAbierto(false)}
                >
                    Registrarse
                </Link>
                </div>
            </li>
            </ul>

        </div>
        )}
    </div>
)
}
