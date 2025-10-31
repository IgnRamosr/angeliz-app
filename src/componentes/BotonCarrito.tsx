import { LucideShoppingBag} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "./useCart";


export const BotonCarritoDeCompras = () => {

const {CantidadItems} = useCart();

    return (
        <Link  className="relative group text-[#6F2521] cursor-pointer hover:text-[#C9A742]" to={"/carrito"}>
            <LucideShoppingBag size={24} className="max-sm:w-7 max-sm:h-7 sm:w-10 sm:h-10 lg:w-8 lg:h-8 group-hover:text-[#C9A742]" />
            <span
            className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#6F2521] group-hover:bg-[#C9A742] px-1 text-[10px] font-semibold  text-white ring-2 ring-white shadow-sm"aria-live="polite">{CantidadItems}
            </span>
            </Link>
    )
}
