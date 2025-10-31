// NotFound.tsx
import { Link } from "react-router-dom";

export default function NoEncontrado() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-[#f57fa6] mb-4 animate-pulse">
            404
          </h1>
          <div className="w-24 h-1 bg-[#fa3f7d] mx-auto rounded-full" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Página no encontrada
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        
        <Link 
          to="/" 
          className="inline-block bg-[#f57fa6] text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:cursor-pointer transform hover:scale-105 transition-all duration-300"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}