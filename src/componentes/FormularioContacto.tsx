    import { useState, type ChangeEvent, useImperativeHandle, forwardRef } from 'react';
    import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react';
    import type { datosFormContacto } from '../assets/types-interfaces/interfaces';

    interface FormErrors {
    [key: string]: string;
    }

    export interface FormularioContactoRef {
    getdatosFormContacto: () => datosFormContacto | null;
    validateForm: () => boolean;
    }

    export const FormularioContacto = forwardRef<FormularioContactoRef>((_props, ref) => {
    const [datosFormContacto, setdatosFormContacto] = useState<datosFormContacto>({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        crearCuenta: false,
        password: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setdatosFormContacto(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
        }));
        
        if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        
        if (!datosFormContacto.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
        if (!datosFormContacto.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
        if (!datosFormContacto.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
        if (!datosFormContacto.email.trim()) {
        newErrors.email = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosFormContacto.email)) {
        newErrors.email = 'Correo electrónico inválido';
        }

        if (datosFormContacto.crearCuenta && !datosFormContacto.password) {
        newErrors.password = 'La contraseña es requerida';
        } else if (datosFormContacto.crearCuenta && datosFormContacto.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Exponer métodos al componente padre mediante ref
    useImperativeHandle(ref, () => ({
        getdatosFormContacto: (): datosFormContacto | null => {
        if (validateForm()) {
            return datosFormContacto;
        }
        return null;
        },
        validateForm
    }));

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6">
        <div className="space-y-4">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                Nombre *
                </label>
                <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    name="nombre"
                    value={datosFormContacto.nombre}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C9A742] transition-all text-sm ${
                    errors.nombre ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="Ingresa tu nombre"
                />
                </div>
                {errors.nombre && (
                <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                Apellido *
                </label>
                <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    name="apellido"
                    value={datosFormContacto.apellido}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C9A742] transition-all text-sm ${
                    errors.apellido ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="Ingresa tu apellido"
                />
                </div>
                {errors.apellido && (
                <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>
                )}
            </div>
            </div>

            {/* Teléfono y Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                Teléfono *
                </label>
                <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="tel"
                    name="telefono"
                    value={datosFormContacto.telefono}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C9A742] transition-all text-sm ${
                    errors.telefono ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="+56 9 1234 5678"
                />
                </div>
                {errors.telefono && (
                <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                Correo Electrónico *
                </label>
                <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="email"
                    name="email"
                    value={datosFormContacto.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C9A742] transition-all text-sm ${
                    errors.email ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="tu@email.com"
                />
                </div>
                {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
            </div>
            </div>



            {/* Crear Cuenta Checkbox */}
            <div className="bg-pink-50 p-4 rounded-lg">
            <label className="flex items-start cursor-pointer">
                <input
                type="checkbox"
                name="crearCuenta"
                checked={datosFormContacto.crearCuenta}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 text-[#C9A742] border-gray-300 rounded focus:ring-1 focus:ring-[#C9A742] cursor-pointer"
                />
                <span className="ml-3 flex items-center text-gray-700 text-sm">
                <UserPlus className="w-4 h-4 mr-2 text-[#C9A742]" />
                ¿Deseas crear una cuenta con los datos agregados?
                </span>
            </label>
            </div>

            {/* Campo de Contraseña Condicional */}
            {datosFormContacto.crearCuenta && (
            <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">
                Contraseña *
                </label>
                <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="password"
                    name="password"
                    value={datosFormContacto.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C9A742] transition-all text-sm ${
                    errors.password ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="Mínimo 6 caracteres"
                />
                </div>
                {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                <p className="text-gray-500 text-xs mt-2">
                Tu cuenta te permitirá realizar pedidos más rápido en el futuro
                </p>
            </div>
            )}
        </div>
        </div>
    );
    });

    FormularioContacto.displayName = 'FormularioContacto';

    export default FormularioContacto;