import { useProductosPorSubcategoria } from "../hooks/useProducts";
import CarruselHorizontal from "../componentes/ModuloCliente/Carrusel";
import { CardProducto } from "../componentes/ModuloCliente/CardProducto";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";

export default function SeccionesPorSubcategoria() {
  const { grupos, cargando, error } = useProductosPorSubcategoria(12);

  //Si está cargando
  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-[#6F2521] animate-spin" />
        <p className="text-lg text-gray-600 font-medium">Cargando productos deliciosos...</p>
      </div>
    );
  }

  //Si existe algún error 
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-8 bg-red-50 border-2 border-red-200 rounded-2xl">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              Ups, algo salió mal
            </h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  //Si la cantidad de grupos es 0
  if (!grupos || grupos.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-12 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <Sparkles className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
          No hay productos disponibles
        </h3>
        <p className="text-gray-500">
          Vuelve pronto para ver nuestras deliciosas creaciones
        </p>
      </div>
    );
  }

  //POR DEFECTO
  return (
    <section className="mx-auto max-w-fit px-4 py-12 space-y-16">
      {grupos.map(({ subcategoria, productos }, index) => (
        <div key={subcategoria.id}>

        {subcategoria.visible &&((
        <div 
          key={subcategoria.id}
          className="flex flex-col justify-center items-center overflow-hidden"

        >

          {/* Header de la sección */}
          <div className="mb-8 ">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#6F2521]" />
              <h2 className="max-sm:text-2xl sm:text-4xl lg:text-4xl xl:text-4xl  font-bold text-[#6F2521] ">
                {subcategoria.nombre}
              </h2>
              <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#6F2521]" />
            </div>
            
            {productos.length > 0 && (
              <p className="text-center text-gray-500 text-sm font-medium">
                {productos.length} {productos.length === 1 ? 'producto' : 'productos'} disponibles
              </p>
            )}
          </div>

          {/* Carrusel de productos */}
          {productos.length > 0 ? (
            <CarruselHorizontal>
              {productos.map((p) => {
                const img = p.imagenes_producto?.[0]?.url;
                return (
                  <div 
                    key={p.id} 
                    className="shrink-0"
                  >
                    <CardProducto
                      id={p.id}
                      nombre={p.nombre}
                      precio={p.precio_base}
                      imagenURL={img}
                    />
                  </div>
                );
              })}
            </CarruselHorizontal>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">
                No hay productos en esta categoría
              </p>
            </div>
          )}

          {/* Separador decorativo */}
          {index < grupos.length - 1 && (
            <div className="mt-16 flex justify-center">
              <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
          )}
        </div>
        ))}
        </div>
      ))}
    </section>
  );
}

