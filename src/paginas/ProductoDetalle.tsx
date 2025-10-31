import { useParams } from "react-router-dom"
import { useProduct } from "../hooks/useProducts";
import { FormularioTorta } from "../componentes/FormulariosTortas";

export const ProductoDetalle = () => {
    const {id} = useParams();
    const productoId = Number(id);
    const {producto} = useProduct(productoId);


    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Sección de Imagen y Descripción */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="aspect-square w-full relative">
                                <img 
                                    src={producto?.imagenes_producto?.[0]?.url} 
                                    alt={producto?.nombre} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6 lg:p-8">
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                                    {producto?.nombre}
                                </h1>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {producto?.descripcion}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Formulario */}
                    <div className="lg:sticky lg:top-8 h-fit">
                        {producto?.tipo_formulario == 'torta' && (
                            <FormularioTorta id={productoId} nombre={producto.nombre} imagenes_producto={producto.imagenes_producto} tamano_producto={producto.tamano_producto} sabor_producto={producto.sabor_producto} tipo_formulario={producto.tipo_formulario} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
