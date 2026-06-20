import { useEffect, useState } from "react"
import { CheckCircle, MessageCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AgradecimientoPostCompra = () => {

const redirigir = useNavigate();

const [segundosRestantes, setSegundosRestantes] = useState<number>(20);

useEffect(() => {
    const intervalo = setInterval(() => {
        setSegundosRestantes((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(intervalo);
}, []);

useEffect(() => {
    if (segundosRestantes === 0) redirigir("/");
}, [segundosRestantes]);

return (
<div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
    <div className="max-w-md w-full">
        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 text-center transform animate-fadeIn">
            {/* Ícono de éxito */}
            <div className="mb-6 flex justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-green-400 to-green-500 rounded-full p-6 shadow-lg">
                        <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            {/* Título */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                ¡Solicitud Exitosa!
            </h1>

            {/* Mensaje principal */}
            <div className="mb-6">
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4">
                    ¡Tu pedido está casi listo! Solo falta un último paso: nos pondremos en contacto contigo por WhatsApp para confirmar los detalles y finalizar la solicitud.
                </p>

                {/* Ícono de WhatsApp */}
                <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 rounded-full px-4 py-2 mx-auto">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-semibold text-sm">Pronto te escribiremos</span>
                </div>
            </div>

            {/* Separador decorativo */}
            <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto mb-6"></div>

            {/* Contador de redirección */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 mb-6">
                <p className="text-gray-700 font-medium mb-3">
                    Serás redirigido al menú principal en:
                </p>
                <div className="flex items-center justify-center gap-3">
                    <div className="bg-white rounded-xl px-6 py-3 shadow-md">
                        <span className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                            {segundosRestantes}
                        </span>
                    </div>
                    <span className="text-gray-600 font-medium">
                        {segundosRestantes === 1 ? 'segundo' : 'segundos'}
                    </span>
                </div>
            </div>

            {/* Botón opcional para ir inmediatamente */}
            <button 
                onClick={() => redirigir("/")}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
                Ir al menú ahora
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>

        {/* Mensaje adicional */}
        <p className="text-center text-gray-500 text-sm mt-6">
            Gracias por confiar en nosotros 🍰
        </p>
    </div>
</div>
);
}