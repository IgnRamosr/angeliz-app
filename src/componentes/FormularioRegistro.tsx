import { Link, useNavigate } from "react-router-dom"
import { CampoInput } from "./CampoInput"
import { useState } from "react"
import { toast } from "react-toastify"
const logo = new URL('../assets/imagenes/logo.png', import.meta.url).href


import {useAutenticacion} from '../hooks/useAuth'
import {useUserProfile} from '../hooks/useUserProfile'
const { registrarse } = useAutenticacion()
const { crearPerfil } = useUserProfile()


import { useValidation } from "../hooks/useValidation"
import { InputTelefono } from "./InputTelefono"



export const FormularioRegistro = () => {

    toast.clearWaitingQueue();

    //Adaptador para el campo teléfono
    const adaptadorInputTelefono = (valor: string) => {
    actualizarCambiosFormulario({
    target: { id: "telefono", value: valor },
    } as React.ChangeEvent<HTMLInputElement>);
    };

    const redirigir = useNavigate();
    const {errores, validarCampo, validarFormularioCompleto} = useValidation()

    const [datosFormulario, setDatosFormulario] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        contraseña: ''
    })

    const actualizarCambiosFormulario = (e: { target: { id: string; value: string } }) =>{
        const {id,value} = e.target
        setDatosFormulario(prev => ({...prev, [id]: value}))
        validarCampo(id, value)
    }

    const enviarFormulario = async (e: { preventDefault: () => void }) =>{
        e.preventDefault();

        if (!validarFormularioCompleto(datosFormulario)){
            return
        }

        const{data,error} = await registrarse({
            email: datosFormulario.correo.trim(),
            password: datosFormulario.contraseña.trim()
        })

        if (error || !data?.user) {
            toast.error('Error, el usuario ya existe')
            toast.clearWaitingQueue();
            return;
        }

        const userId = data.user.id;

        const {error: errorPerfil} = await crearPerfil({
            id: userId,
            nombre: datosFormulario.nombre.trim().toUpperCase(),
            apellido: datosFormulario.apellido.trim().toUpperCase(),
            telefono: datosFormulario.telefono.trim()
        })

        if (errorPerfil) {
        toast.error('Error al intentar crear el usuario')
        toast.clearWaitingQueue();
        return;
        }

        toast.success('Usuario creado con exito')

        redirigir('/');

        toast.clearWaitingQueue();
        
    }

return (
    <div className="relative w-full h-full bg-white p-6 pt-4 rounded-xl shadow-lg">

    <img src={logo} alt="Logo" className="absolute top-15 left-1/2 -translate-x-1/2  w-80 pointer-events-none" />

    <form onSubmit={enviarFormulario} className=" max-sm:pt-56 sm:pt-75 md:pt-48  flex flex-col sm:gap-15 max-sm:gap-5 md:gap-8 ">

        <CampoInput label={"Nombre"} type={"text"} id={"nombre"} value={datosFormulario.nombre} onChange={actualizarCambiosFormulario} error={errores.nombre} min={1} max={12}/>

        <CampoInput label={"Apellido"} type={"text"} id={"apellido"} value={datosFormulario.apellido} onChange={actualizarCambiosFormulario} error={errores.apellido} min={1} max={12}/>

        <InputTelefono label={"Teléfono"} value={datosFormulario.telefono} onChange={adaptadorInputTelefono} error={errores.telefono}/>

        <CampoInput label={"Correo electrónico"} type={"email"} id={"correo"} value={datosFormulario.correo} onChange={actualizarCambiosFormulario} error={errores.correo} min={1} max={40}/>

        <CampoInput label={"Contraseña"} type={"password"} id={"contraseña"} value={datosFormulario.contraseña} onChange={actualizarCambiosFormulario} error={errores.contraseña} min={1} max={10}/>

        <div className="flex flex-col">
        <button type="submit" className=" bg-[#FF6E9D] hover:bg-[#C9A742] text-[#f8f8f8] hover:text-white transition-all cursor-pointer font-medium  mb-5 rounded-full px-4 py-2 sm:mt-20 md:mt-8 max-sm:mt-20">Registrarme</button>
        <Link to={"/inicio"} className="text-center text-[#FF6E9D] hover:text-[#C9A742] transform-all">¿Ya tienes una cuenta? inicia sesión aquí</Link>
        </div>

    </form>


    </div>
)
}
