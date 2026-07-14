    import { useState, type ChangeEvent, useImperativeHandle, forwardRef } from 'react';
    import { MapPin, Home, MessageSquare, UserCheck, User, Phone } from 'lucide-react';
    import type { DatosEntregaDelivery } from '../../assets/types-interfaces/types';
    import type { FormularioDireccionEntregaRef } from '../../assets/types-interfaces/interfaces';

    interface FormErrors {
    [key: string]: string;
    }


    const estadoInicial: DatosEntregaDelivery = {
    direccion: '',
    comuna: '',
    calleReferencia: '',
    deptoOCasa: 'Casa',
    observacion: '',
    recibePedidoTitular: true,
    receptorNombre: '',
    receptorApellido: '',
    receptorTelefono: '',
    };

    export const FormularioDireccionEntrega = forwardRef<FormularioDireccionEntregaRef>((_props, ref) => {
    const [datos, setDatos] = useState<DatosEntregaDelivery>(estadoInicial);
    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setDatos(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
        }));

        if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validar = (): boolean => {
        const nuevosErrores: FormErrors = {};

        if (!datos.direccion.trim()) nuevosErrores.direccion = 'La dirección es requerida';
        if (!datos.comuna.trim()) nuevosErrores.comuna = 'La comuna es requerida';

        if (!datos.recibePedidoTitular) {
        if (!datos.receptorNombre?.trim()) nuevosErrores.receptorNombre = 'El nombre de quien recibe es requerido';
        if (!datos.receptorApellido?.trim()) nuevosErrores.receptorApellido = 'El apellido de quien recibe es requerido';
        if (!datos.receptorTelefono?.trim()) nuevosErrores.receptorTelefono = 'El teléfono de contacto es requerido';
        }

        setErrors(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    useImperativeHandle(ref, () => ({
        getDatosEntrega: (): DatosEntregaDelivery | null => {
        if (validar()) return datos;
        return null;
        },
    }));

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#6F2521]" />
            Datos de entrega (Delivery)
        </h3>

        <div className="space-y-4">
            {/* Dirección y Comuna */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Dirección *</label>
                <input
                type="text"
                name="direccion"
                value={datos.direccion}
                onChange={handleChange}
                maxLength={100}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C9A742] transition-all text-sm ${errors.direccion ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="Calle y número"
                />
                {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Comuna *</label>
                <input
                type="text"
                name="comuna"
                value={datos.comuna}
                onChange={handleChange}
                maxLength={50} 
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C9A742] transition-all text-sm ${errors.comuna ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="Ej: Maipú"
                />
                {errors.comuna && <p className="text-red-500 text-xs mt-1">{errors.comuna}</p>}
            </div>
            </div>

            {/* Calle de referencia y Depto/Casa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Calle de referencia</label>
                <input
                type="text"
                name="calleReferencia"
                value={datos.calleReferencia}
                onChange={handleChange}
                maxLength={150}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C9A742] transition-all text-sm"
                placeholder="Ej: Esquina con Manuel Rodríguez"
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                <Home className="inline w-4 h-4 mr-1 text-[#C9A742]" />
                ¿Depto o Casa? *
                </label>
                <select
                name="deptoOCasa"
                value={datos.deptoOCasa}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C9A742] transition-all text-sm bg-white"
                >
                <option value="Casa">Casa</option>
                <option value="Departamento">Departamento</option>
                </select>
            </div>
            </div>

            {/* Observación */}
            <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">
                <MessageSquare className="inline w-4 h-4 mr-1 text-[#C9A742]" />
                Observación
            </label>
            <textarea
                name="observacion"
                value={datos.observacion}
                onChange={handleChange}
                maxLength={400}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C9A742] transition-all text-sm resize-none"
                placeholder="N° de depto en caso de dejar en conserjería"
            />
            </div>

            {/* ¿Tú recibirás el pedido? */}
            <div className="bg-pink-50 p-4 rounded-lg">
            <label className="flex items-start cursor-pointer">
                <input
                type="checkbox"
                name="recibePedidoTitular"
                checked={datos.recibePedidoTitular}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 text-[#C9A742] border-gray-300 rounded focus:ring-1 focus:ring-[#C9A742] cursor-pointer"
                />
                <span className="ml-3 flex items-center text-gray-700 text-sm">
                <UserCheck className="w-4 h-4 mr-2 text-[#C9A742]" />
                ¿Tú recibirás el pedido?
                </span>
            </label>
            </div>

            {/* Datos de quien recibe, si no es el titular */}
            {!datos.recibePedidoTitular && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Nombre de quien recibe *</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                    type="text"
                    name="receptorNombre"
                    value={datos.receptorNombre}
                    onChange={handleChange}
                    maxLength={50}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C9A742] transition-all text-sm ${errors.receptorNombre ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Nombre"
                    />
                </div>
                {errors.receptorNombre && <p className="text-red-500 text-xs mt-1">{errors.receptorNombre}</p>}
                </div>

                <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Apellido de quien recibe *</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                    type="text"
                    name="receptorApellido"
                    value={datos.receptorApellido}
                    maxLength={50}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C9A742] transition-all text-sm ${errors.receptorApellido ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Apellido"
                    />
                </div>
                {errors.receptorApellido && <p className="text-red-500 text-xs mt-1">{errors.receptorApellido}</p>}
                </div>

                <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2 text-sm">Teléfono de contacto adicional *</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                    type="tel"
                    name="receptorTelefono"
                    value={datos.receptorTelefono}
                    onChange={handleChange}
                    maxLength={20}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C9A742] transition-all text-sm ${errors.receptorTelefono ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="+56 9 1234 5678"
                    />
                </div>
                {errors.receptorTelefono && <p className="text-red-500 text-xs mt-1">{errors.receptorTelefono}</p>}
                </div>
            </div>
            )}
        </div>
        </div>
    );
    });

    FormularioDireccionEntrega.displayName = 'FormularioDireccionEntrega';

    export default FormularioDireccionEntrega;