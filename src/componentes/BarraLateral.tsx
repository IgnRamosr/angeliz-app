import { motion } from "framer-motion";
import { LinksBarraNavegacion } from "./LinksBarraNavegacion";
import useUserSession from "../hooks/useUserSession";


interface PropsBarraLateral {
    estado: boolean;
}



export const BarraLateral = ({estado}: PropsBarraLateral) => {

    const sesion = useUserSession();

    return (
        <motion.aside className={`fixed top-0 left-0 w-64 h-full bg-pink-100 shadow-lg transform transition-transform duration-300  ${estado ? 'translate-x-0' : '-translate-x-full'}`}>
            <nav className="flex text-[#6F2521] font-medium items-center">
                <LinksBarraNavegacion sesion={sesion} columna={true}></LinksBarraNavegacion>
            </nav>
        </motion.aside>
    )
}
