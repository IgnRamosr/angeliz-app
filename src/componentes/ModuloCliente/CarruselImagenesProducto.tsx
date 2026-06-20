import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Imagen } from "../../assets/types-interfaces/interfaces";

interface Props {
    imagenes: Imagen[];
    nombre: string;
}

export const CarruselImagenesProducto = ({ imagenes, nombre }: Props) => {
    const ordenadas = [...(imagenes ?? [])].sort((a, b) => Number(b.es_principal) - Number(a.es_principal));
    const [indice, setIndice] = useState(0);

    const anterior = () => setIndice(i => (i - 1 + ordenadas.length) % ordenadas.length);
    const siguiente = () => setIndice(i => (i + 1) % ordenadas.length);

    if (!ordenadas.length) return (
        <div className="aspect-square w-full bg-gray-100 flex items-center justify-center text-gray-400">
            Sin imagen
        </div>
    );

    return (
        <div className="flex flex-col gap-3">
            {/* Imagen principal */}
            <div className="aspect-square w-full relative overflow-hidden">
                <img
                    src={ordenadas[indice].url}
                    alt={`${nombre} ${indice + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-300"
                />

                {ordenadas.length > 1 && (
                    <>
                        <button
                            onClick={anterior}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={siguiente}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
                        >
                            <ChevronRight size={20} />
                        </button>

                        {/* Indicadores */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {ordenadas.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setIndice(i)}
                                    className={`w-2 h-2 rounded-full transition-colors ${i === indice ? "bg-white" : "bg-white/50"}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Miniaturas */}
            {ordenadas.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {ordenadas.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setIndice(i)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === indice ? "border-pink-400" : "border-transparent"}`}
                        >
                            <img src={img.url} alt={`miniatura ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};