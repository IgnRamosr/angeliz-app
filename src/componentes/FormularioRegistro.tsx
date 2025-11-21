import { Link, useNavigate } from "react-router-dom"
import { CampoInput } from "./CampoInput"
import { useState } from "react"
import { toast } from "react-toastify"
const logo = new URL('../assets/imagenes/logo.png', import.meta.url).href


import {useAutenticacion} from '../hooks/useAuth'
import {useUserProfile} from '../hooks/useUserProfile'
const { registrarse, promoverAnonimo } = useAutenticacion()
const { crearOActualizarPerfil } = useUserProfile()


import { useValidation } from "../hooks/useValidation"
import { InputTelefono } from "./InputTelefono"
import { supabase } from "../supabase/supabaseClient"



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

const enviarFormulario = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validarFormularioCompleto(datosFormulario)) return;

  // ¿El usuario que navega ahora es anónimo?
  const { data: u } = await supabase.auth.getUser();
  const esAnon =
    !!u.user && ((u.user as any).is_anonymous ?? u.user.app_metadata?.provider === "anon");

  // 1) Crear cuenta
  const authRes = esAnon
    ? await promoverAnonimo({
        email: datosFormulario.correo.trim(),
        password: datosFormulario.contraseña.trim(),
      })
    : await registrarse({
        email: datosFormulario.correo.trim(),
        password: datosFormulario.contraseña.trim(),
      });

  if (authRes.error) {
    // Errores típicos: email inválido, password muy corta (< 6), email ya usado, etc.
    toast.error(authRes.error.message);
    return;
  }

  // 2) Obtener el id para el perfil
  const userId =
    authRes.data?.user?.id ?? authRes.data?.user?.id ?? u.user?.id ?? null;

  if (!userId) {
    // Probablemente confirmación por correo activada
    toast.info("Revisa tu correo y confirma tu cuenta para completar el registro.");
    return;
  }

  // 3) Crear/actualizar perfil
  const { error: errorPerfil } = await crearOActualizarPerfil({
    id: userId,
    nombre: datosFormulario.nombre.trim().toUpperCase(),
    apellido: datosFormulario.apellido.trim().toUpperCase(),
    telefono: datosFormulario.telefono.trim(),
  });
  if (errorPerfil) {
    toast.error("No se pudo guardar el perfil.");
    return;
  }

  toast.success("¡Cuenta creada con éxito!");
  redirigir("/");
};

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
