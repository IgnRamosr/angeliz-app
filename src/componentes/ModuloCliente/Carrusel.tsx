import { type PropsWithChildren, useRef } from "react";


type Props = PropsWithChildren<{ className?: string }>;

export default function CarruselHorizontal({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);



  return (
    <div 
      className={`relative  ${className ?? ""}`}

    >

      {/* Contenedor del carrusel */}
      <div
        ref={ref}
        className={`
          flex gap-6 overflow-x-auto scroll-smooth 
          snap-x snap-mandatory pb-6 px-1
          scrollbar-thin scrollbar-thumb-gray-300 
          scrollbar-track-gray-100/50
          hover:scrollbar-thumb-gray-400
          transition-all duration-200
        `}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#d1d5db #f3f4f620"
        }}
      >
        {/* Contenido duplicado x3 para scroll infinito */}
        {children}

      </div>
    </div>
  );
}

