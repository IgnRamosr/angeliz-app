import { supabase } from "../supabase/supabaseClient";


interface ParametrosAutenticacion{
  email: string
  password: string
}

export const useAutenticacion = () =>{


  const registrarse = async ({email, password}: ParametrosAutenticacion) =>{
    const {data, error} = await supabase.auth.signUp({
      email,
      password
    })
    return {data,error}
  }

  const iniciarSesion = async ({email,password}: ParametrosAutenticacion) =>{
    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return {data,error}
  }

  const cerrarSesion = async () => { await supabase.auth.signOut();}

    return{registrarse, iniciarSesion, cerrarSesion}
}