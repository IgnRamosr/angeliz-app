const cupcake = new URL('../assets/imagenes/cupcake.svg', import.meta.url).href;


export const Separador = () => {
return (
    <div className="flex my-8 px-4 items-center justify-center">
        <div className="flex-grow border-t border-[#6F2521]"></div>
        <img src={cupcake} alt="Cupcake" className="mx-4 w-16 object-contain" />
        <div className="flex-grow border-t border-[#6F2521]"></div>
    </div>
)
}
