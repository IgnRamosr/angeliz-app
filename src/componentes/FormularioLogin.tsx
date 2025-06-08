import { Link, useNavigate } from "react-router-dom"
import { useAutenticacion } from "../hooks/useAuth"
import { CampoInput } from "./CampoInput"
import { useState } from "react"
const { iniciarSesion } = useAutenticacion()
const logo = new URL('../assets/imagenes/logo.png', import.meta.url).href

export const FormularioLogin = () => {


  const redirigir = useNavigate();

  const [credenciales, setcredenciales] = useState({
    correo: '',
    contraseña: ''
  })

      const actualizarCambiosFormulario = (e: { target: { id: string; value: string } }) =>{
        const {id,value} = e.target
        setcredenciales(prev => ({...prev, [id]: value}))
    }

    const enviarFormulario = async (e: { preventDefault: () => void }) =>{
        e.preventDefault();

        const{data,error} = await iniciarSesion({
            email: credenciales.correo,
            password: credenciales.contraseña
        })

        if(!data?.user || error){
          console.log('Error al iniciar sesión', error)
          return
        }

        redirigir('/MenuPrincipal');

    }

  return (
    <div className="relative w-full h-full bg-white p-6 pt-4 rounded-xl shadow-lg">

      <img src={logo} alt="Logo" className="absolute -top-10 left-1/2 -translate-x-1/2  w-80 pointer-events-none" />

      <form onSubmit={enviarFormulario} className=" max-sm:pt-56 sm:pt-75 md:pt-48 custom-pt flex flex-col sm:gap-15 max-sm:gap-5 md:gap-10 ">

        <CampoInput label={"Correo electrónico"} type={"email"} id={"correo"} value={credenciales.correo} onChange={actualizarCambiosFormulario}/>

        <CampoInput label={"Contraseña"} type={"password"} id={"contraseña"} value={credenciales.contraseña} onChange={actualizarCambiosFormulario}/>

        <div className="flex flex-col">
          <button type="submit" className="bg-[#FF6E9D] hover:bg-[#6F2521] hover:text-white transition-all cursor-pointer px-4 py-2 sm:mt-20 md:mt-8 max-sm:mt-20 custom-mt mb-5 rounded-xl">Ingresar</button>
          <Link to={"/registro"} className="text-center text-[#FF6E9D] hover:text-[#6F2521] transform-all">¿No tienes una cuenta? Registrate aquí</Link>
        </div>


      </form>


    </div>
  )
}
