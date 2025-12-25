import { type PropsWithChildren, useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = PropsWithChildren<{ className?: string }>;

export default function CarruselHorizontal({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [showButtons, setShowButtons] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Duplicar contenido para scroll infinito
  useEffect(() => {
    if (ref.current) {
      const container = ref.current;
      const contentWidth = container.scrollWidth / 3; // Dividido por 3 porque tenemos contenido triplicado
      
      // Iniciar en el medio (contenido original)
      container.scrollLeft = contentWidth;
    }
  }, [children]);

  // Manejar scroll infinito
  const handleScroll = () => {
    if (!ref.current) return;
    
    const container = ref.current;
    const contentWidth = container.scrollWidth / 3;
    const currentScroll = container.scrollLeft;
    
    // Si llegamos al final, volver al centro (sin animación para que sea imperceptible)
    if (currentScroll >= contentWidth * 2) {
      container.scrollLeft = contentWidth;
    }
    // Si llegamos al inicio, ir al centro (sin animación)
    else if (currentScroll <= 0) {
      container.scrollLeft = contentWidth;
    }
  };

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, [children]);

  const scroll = (direction: "left" | "right") => {
    if (!ref.current) return;
    
    const container = ref.current;
    const scrollAmount = 320;

    if (direction === "right") {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  // Funciones para drag & drop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 2;
    ref.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className={`relative  ${className ?? ""}`}
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      {/* Botón Anterior */}
      <button
        aria-label="Anterior"
        onClick={() => scroll("left")}
        className={`
          absolute left-0 top-1/2 -translate-y-1/2 z-20 
          rounded-full bg-white
          shadow-xl hover:shadow-2xl
          p-3.5 hidden sm:flex items-center justify-center
          transition-all duration-300 ease-out
          border border-gray-100
          hover:scale-110 hover:bg-gray-50 cursor-pointer
          ${showButtons ? 'opacity-100 translate-x-2' : 'opacity-0 -translate-x-4'}
        `}
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" strokeWidth={2.5} />
      </button>

      {/* Contenedor del carrusel */}
      <div
        ref={ref}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`
          flex gap-6 overflow-x-auto scroll-smooth 
          snap-x snap-mandatory pb-6 px-1
          scrollbar-thin scrollbar-thumb-gray-300 
          scrollbar-track-gray-100/50
          hover:scrollbar-thumb-gray-400
          ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}
          transition-all duration-200
        `}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#d1d5db #f3f4f620"
        }}
      >
        {/* Contenido duplicado x3 para scroll infinito */}
        {children}
        {children}
        {children}
      </div>

      {/* Botón Siguiente */}
      <button
        aria-label="Siguiente"
        onClick={() => scroll("right")}
        className={`
          absolute right-0 top-1/2 -translate-y-1/2 z-20 
          rounded-full bg-white
          shadow-xl hover:shadow-2xl
          p-3.5 hidden sm:flex items-center justify-center
          transition-all duration-300 ease-out
          border border-gray-100
          hover:scale-110 hover:bg-gray-50 cursor-pointer
          ${showButtons ? 'opacity-100 -translate-x-2' : 'opacity-0 translate-x-4'}
        `}
      >
        <ChevronRight className="w-6 h-6 text-gray-800" strokeWidth={2.5} />
      </button>

      {/* Gradientes decorativos */}
      <div 
        className={`
          absolute left-0 top-0 bottom-6 w-20 
          bg-gradient-to-r from-white via-white/80 to-transparent 
          pointer-events-none transition-opacity duration-300 
          hidden sm:block
          ${showButtons ? 'opacity-100' : 'opacity-0'}
        `} 
      />
      <div 
        className={`
          absolute right-0 top-0 bottom-6 w-20 
          bg-gradient-to-l from-white via-white/80 to-transparent 
          pointer-events-none transition-opacity duration-300 
          hidden sm:block
          ${showButtons ? 'opacity-100' : 'opacity-0'}
        `} 
      />
    </div>
  );
}

// Componente de demostración
function Demo() {
  const cakes = [
    { id: 1, name: "Torta de Chocolate", emoji: "🍫", color: "from-amber-400 to-amber-600" },
    { id: 2, name: "Torta de Fresa", emoji: "🍓", color: "from-pink-400 to-pink-600" },
    { id: 3, name: "Torta de Vainilla", emoji: "🍰", color: "from-yellow-400 to-yellow-600" },
    { id: 4, name: "Torta Red Velvet", emoji: "❤️", color: "from-red-400 to-red-600" },
    { id: 5, name: "Torta de Limón", emoji: "🍋", color: "from-lime-400 to-lime-600" },
    { id: 6, name: "Torta de Zanahoria", emoji: "🥕", color: "from-orange-400 to-orange-600" },
    { id: 7, name: "Torta de Café", emoji: "☕", color: "from-amber-600 to-amber-800" },
    { id: 8, name: "Torta de Coco", emoji: "🥥", color: "from-cyan-400 to-cyan-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Carrusel Premium
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explora nuestras deliciosas tortas. Arrastra con el mouse o usa las flechas. 
            <span className="hidden sm:inline"> El carrusel es infinito.</span>
          </p>
        </div>
        
        <CarruselHorizontal>
          {cakes.map((cake) => (
            <div
              key={cake.id}
              className="
                min-w-[300px] h-80 
                rounded-3xl shadow-lg
                flex flex-col items-center justify-center
                snap-center transition-all duration-300
                cursor-pointer
                bg-gradient-to-br bg-white
                border border-gray-200
                hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-2
                relative overflow-hidden
                group/card
              "
            >
              {/* Fondo gradiente */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cake.color} opacity-0 group-hover/card:opacity-10 transition-opacity duration-300`} />
              
              {/* Contenido */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-8xl mb-6 transition-transform duration-300 group-hover/card:scale-110 group-hover/card:rotate-12">
                  {cake.emoji}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 px-6 text-center mb-2">
                  {cake.name}
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent group-hover/card:via-[#6F2521] transition-colors duration-300" />
              </div>

              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 -translate-x-full group-hover/card:translate-x-full" style={{ transition: 'transform 0.8s ease, opacity 0.3s ease' }} />
            </div>
          ))}
        </CarruselHorizontal>

        {/* Instrucciones */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-lg">👆</span>
            </div>
            <span className="hidden sm:inline">Arrastra para navegar</span>
            <span className="sm:hidden">Desliza para navegar</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-lg">⬅️➡️</span>
            </div>
            <span>Usa las flechas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-lg">🔄</span>
            </div>
            <span>Carrusel infinito</span>
          </div>
        </div>
      </div>
    </div>
  );
}