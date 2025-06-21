import { CardProducto } from "../componentes/CardProducto";
import { Separador } from "../componentes/Separador";
import { useProducts } from "../hooks/useProducts"


export const Productos = () => {

  const {productos} = useProducts(); 

  return (
    <div>

      <Separador/>

      <div className=" grid grid-cols-1 md:grid-cols-3 gap-4 p-4 items-center justify-items-center">
        {productos.map((producto) => {
          const imagenPrincipal = producto.imagenes_producto?.find(img => img.es_principal)

          if (!imagenPrincipal) return null;

          return(
            <CardProducto nombre={producto.nombre} precio={producto.precio_base} imagenURL={imagenPrincipal?.url}/>
          )


        })}
      </div>
    </div>
  )
}
