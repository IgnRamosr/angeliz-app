import { AnimatePresence, motion } from "framer-motion";
import { LinksBarraNavegacion } from "./LinksBarraNavegacion";
import useUserSession from "../hooks/useUserSession";
import type {PropsBarraLateral} from "../assets/types-interfaces/interfaces"



export const BarraLateral = ({estado,cambiarEstado}: PropsBarraLateral) => {

    const sesion = useUserSession();

    return (
        <AnimatePresence>
            {estado &&(
                <>
                    <motion.div initial={{opacity:0}} animate={{opacity:0.5}} exit={{opacity:0}} className="fixed inset-0 bg-black z-10 lg:hidden" onClick={cambiarEstado}></motion.div>
                    <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.1 }} className={`fixed top-0 left-0 w-64 h-full bg-pink-100 shadow-lg transform transition-transform duration-300 z-20 lg:hidden `}>
                        <nav className="flex text-[#6F2521] font-medium items-center">
                            <LinksBarraNavegacion sesion={sesion} columna={true}></LinksBarraNavegacion>
                        </nav>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    )
}
