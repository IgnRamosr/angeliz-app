
type Card = {
    nombre: string;
    precio: number;
    imagenURL: string | undefined;
}



export const CardProducto = ({nombre, precio, imagenURL}: Card) => {
return (
    <div className="w-full max-w-xs text-left cursor-pointer">
        <div className="bg-white rounded-lg overflow-hidden">
            <img src={imagenURL} alt={nombre} />
        </div>
        <div className="p-2 flex items-center flex-col">
            <h2 className="text-lg font-semibold text-gray-950">{nombre}</h2>
            {/* <p className="text-base text-orange-600 font-bold mt-2">${precio}</p> */}
        </div>
    </div>
)
}
