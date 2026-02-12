    // src/pages/BuscarProductos.tsx
    import { useEffect } from "react";
    import { useParams } from "react-router-dom";
    import { useProductSearch } from "../hooks/useProducts";
    import { CardProducto } from "../componentes/ModuloCliente/CardProducto"; // tu card

    export default function BuscarProductos() {
    const {nombre} = useParams();
    const {productos, cargando, error, buscar } = useProductSearch();

    useEffect(() => {
        if (nombre) buscar(nombre);
    }, [nombre, buscar]);

    return (
        <section className="mx-auto max-w-6xl p-4 flex flex-col items-center">
        <h1 className="mb-4 text-2xl font-semibold">Resultados para “{nombre}”</h1>

        {cargando && <p>Buscando…</p>}
        {error && <p className="text-red-600">⚠️ {error}</p>}

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productos?.map((p) => (
            <CardProducto
                key={p.id}
                id={Number(p.id)}
                nombre={p.nombre}
                precio={p.precio_base}
                imagenURL={p.imagenes_producto![0].url}
            />
            ))}
        </div>

        {!cargando && !error && productos?.length === 0 && nombre && (
            <p className="mt-6 text-sm text-gray-500">No se encontraron productos.</p>
        )}
        </section>
    );
    }
