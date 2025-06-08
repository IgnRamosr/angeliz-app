import { Link, useNavigate } from "react-router-dom"
import { CampoInput } from "./CampoInput"
import { useState } from "react"
const logo = new URL('../assets/imagenes/logo.png', import.meta.url).href


import {useAutenticacion} from '../hooks/useAuth'
import {useUserProfile} from '../hooks/useUserProfile'
const { registrarse } = useAutenticacion()
const { crearPerfil } = useUserProfile()

export const FormularioRegistro = () => {

    const redirigir = useNavigate();

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
    }

    const enviarFormulario = async (e: { preventDefault: () => void }) =>{
        e.preventDefault();

        const{data,error} = await registrarse({
            email: datosFormulario.correo,
            password: datosFormulario.contraseña
        })

        if (error || !data?.user) {
            console.error("Error de registro:", error);
            return;
        }

        const userId = data.user.id;

        const {error: errorPerfil} = await crearPerfil({
            id: userId,
            nombre: datosFormulario.nombre,
            apellido: datosFormulario.apellido,
            telefono: datosFormulario.telefono
        })

        if (errorPerfil) {
        console.error("Error al guardar perfil:", errorPerfil);
        return;
        }

        redirigir('/');

    }

return (
    <div className="relative w-full h-full bg-white p-6 pt-4 rounded-xl shadow-lg">

    <img src={logo} alt="Logo" className="absolute -top-10 left-1/2 -translate-x-1/2  w-80 pointer-events-none" />

    <form onSubmit={enviarFormulario} className=" max-sm:pt-56 sm:pt-75 md:pt-48  flex flex-col sm:gap-15 max-sm:gap-5 md:gap-8 ">

        <CampoInput label={"Nombre"} type={"text"} id={"nombre"} value={datosFormulario.nombre} onChange={actualizarCambiosFormulario}/>

        <CampoInput label={"Apellido"} type={"text"} id={"apellido"} value={datosFormulario.apellido} onChange={actualizarCambiosFormulario}/>

        <CampoInput label={"Teléfono"} type={"tel"} id={"telefono"} value={datosFormulario.telefono} onChange={actualizarCambiosFormulario}/>

        <CampoInput label={"Correo electrónico"} type={"email"} id={"correo"} value={datosFormulario.correo} onChange={actualizarCambiosFormulario}/>

        <CampoInput label={"Contraseña"} type={"password"} id={"contraseña"} value={datosFormulario.contraseña} onChange={actualizarCambiosFormulario}/>

        <div className="flex flex-col">
        <button type="submit" className="bg-[#FF6E9D] hover:bg-[#6F2521] hover:text-white transition-all cursor-pointer px-4 py-2 sm:mt-20 md:mt-8 max-sm:mt-20  mb-5 rounded-xl">Registrarme</button>
        <Link to={"/"} className="text-center text-[#FF6E9D] hover:text-[#6F2521] transform-all">¿Ya tienes una cuenta? inicia sesión aquí</Link>
        </div>

    </form>


    </div>
)
}
