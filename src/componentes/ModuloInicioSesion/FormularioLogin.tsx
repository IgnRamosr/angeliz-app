import { Link, useNavigate } from "react-router-dom"
import { useAutenticacion } from "../../hooks/useAuth"
import { CampoInput } from "../Otros/CampoInput"
import { useState } from "react"
const { iniciarSesion } = useAutenticacion()
const logo = new URL('../../assets/imagenes/logo.png', import.meta.url).href
import { useValidation } from "../../hooks/useValidation"
import { toast } from "react-toastify"



export const FormularioLogin = () => {

  toast.clearWaitingQueue();

  const redirigir = useNavigate();

  const {errores, validarCampo, validarFormularioCompleto} = useValidation()

  const [credenciales, setcredenciales] = useState({
    correo: '',
    contraseña: ''
  })

  const actualizarCambiosFormulario = (e: { target: { id: string; value: string } }) =>{
        const {id,value} = e.target
        setcredenciales(prev => ({...prev, [id]: value}))
        validarCampo(id, value)
  }

  const enviarFormulario = async (e: { preventDefault: () => void }) =>{
        e.preventDefault();

        if (!validarFormularioCompleto(credenciales)){
            return
        }

        const{data,error} = await iniciarSesion({
            email: credenciales.correo,
            password: credenciales.contraseña
        })

        if(!data?.user || error){
          toast.error('Credenciales invalidas o usuario inexistente')
          toast.clearWaitingQueue();
          return 
        }

        redirigir('/');
        toast.clearWaitingQueue();

  }

  return (
    <div className="relative min-h-screen w-full bg-white p-6 pt-4 rounded-xl shadow-lg">

      <img src={logo} alt="Logo" className="absolute top-25 left-1/2 -translate-x-1/2  w-80 pointer-events-none" />

      <form onSubmit={enviarFormulario} className=" max-sm:pt-56 max-sm:gap-5 sm:pt-75 sm:gap-15 md:gap-10 custom-pt flex flex-col ">

        <CampoInput label={"Correo electrónico"} type={"email"} id={"correo"} value={credenciales.correo} onChange={actualizarCambiosFormulario} error={errores.correo}/>

        <CampoInput label={"Contraseña"} type={"password"} id={"contraseña"} value={credenciales.contraseña} onChange={actualizarCambiosFormulario} error={errores.contraseña}/>

        <div className="flex flex-col">
          <button type="submit" className="max-sm:mt-28 sm:mt-20 md:mt-64 custom-mt bg-[#FF6E9D] hover:bg-[#C9A742] text-[#f8f8f8] hover:text-white transition-all cursor-pointer font-medium px-4 py-2 mb-5 rounded-full">Ingresar</button>
          <Link to={"/registro"} className="text-center text-[#FF6E9D] hover:text-[#C9A742] transform-all">¿No tienes una cuenta? Registrate aquí</Link>
        </div>

      </form>


    </div>
  )
}
