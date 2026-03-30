import { type PropsWithChildren, useRef } from "react";


type Props = PropsWithChildren<{ className?: string }>;

export default function CarruselHorizontal({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);



  return (
    <div 
      className={`relative max-lg:w-full  ${className ?? ""}`}

    >

      {/* Contenedor del carrusel */}
      <div
        ref={ref}
        className={`
          flex gap-6 overflow-x-auto scroll-smooth 
          snap-x snap-mandatory pb-6
          scrollbar-thin scrollbar-thumb-gray-300 
          scrollbar-track-gray-100/50
          hover:scrollbar-thumb-gray-400
          transition-all duration-200
        `}
      >
        <div className="flex gap-6 mx-auto px-1">
          {children}
        </div>
      </div>
    </div>
  );
}

