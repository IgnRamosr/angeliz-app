import { useParams } from "react-router-dom"
import { useProduct } from "../hooks/useProducts";
import { FormularioTorta } from "../componentes/ModuloCliente/FormulariosTortas";
import { FormularioGalletas } from "../componentes/ModuloCliente/FormularioGalletas";
import { CarruselImagenesProducto } from "../componentes/ModuloCliente/CarruselImagenesProducto";
import { FormularioMiniCake } from "../componentes/ModuloCliente/FormularioMiniCake";

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
                            <CarruselImagenesProducto
                                imagenes={producto?.imagenes_producto ?? []}
                                nombre={producto?.nombre ?? ""}
                            />
                            <div className="p-6 lg:p-8">
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                                    {producto?.nombre}
                                </h1>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {producto?.descripcion}
                                </p>

                            {(producto?.nombre.toLocaleLowerCase().includes('crea') || producto?.nombre.toLocaleLowerCase().includes('minicake')) && (
                                <div className="flex items-start gap-2 mt-4 bg-pink-50 border border-pink-200 rounded-lg px-4 py-3">
                                    <span className="text-pink-400 text-lg leading-none mt-0.5">✦</span>
                                    <p className="text-sm text-pink-700">
                                        El precio de este producto puede variar según el diseño y la complejidad de la decoración solicitada.
                                    </p>
                                </div>
                            )}
                            </div>
                        </div>
                    </div>

                    {/* Sección de Formulario */}
                    <div className="lg:sticky lg:top-8 h-fit">
                        {producto?.tipo_formulario == 'torta' && (
                            <FormularioTorta id={productoId} nombre={producto.nombre} imagenes_producto={producto.imagenes_producto} tamano_producto={producto.tamano_producto} sabor_producto={producto.sabor_producto} tipo_formulario={producto.tipo_formulario} />
                        )}
                        {producto?.tipo_formulario == 'galletas' && (
                            <FormularioGalletas id={productoId} nombre={producto.nombre} imagenes_producto={producto.imagenes_producto} tipo_formulario={producto.tipo_formulario} />
                        )}
                        {producto?.tipo_formulario == 'minicake' && (
                            <FormularioMiniCake id={productoId} nombre={producto.nombre} imagenes_producto={producto.imagenes_producto} sabor_producto={producto.sabor_producto} tipo_formulario={producto.tipo_formulario} />
                        )}                    
                    </div>
                </div>
            </div>
        </div>
    )
}
