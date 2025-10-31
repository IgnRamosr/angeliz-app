import { supabase } from "../supabase/supabaseClient";
import type {ParametrosAutenticacion} from "../assets/types-interfaces/interfaces"

export const useAutenticacion = () =>{


  const registrarse = async ({email, password}: ParametrosAutenticacion) =>{
    const {data, error} = await supabase.auth.updateUser({
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

  const cerrarSesion = async () => { 
    await supabase.auth.signOut();

    const sesionAnonima = localStorage.getItem("anon_session");
    if(sesionAnonima){
      const sesionAnonimaGuardada = JSON.parse(sesionAnonima);
      if(sesionAnonimaGuardada.access_token && sesionAnonimaGuardada.refresh_token){
        const {error} = await supabase.auth.setSession({
          access_token: sesionAnonimaGuardada.access_token,
          refresh_token: sesionAnonimaGuardada.refresh_token
        });
        if(!error){
          return error;
        }
      }
    }

    await supabase.auth.signInAnonymously?.();
  }

  const asignarSesionAnonima = async () => {
    const {data: {session}} = await supabase.auth.getSession();
    if(session) return session;

  const sesionAnonima = localStorage.getItem("anon_session");
  if (sesionAnonima) {
    const sesionAnonimaGuardada = JSON.parse(sesionAnonima);
    if (sesionAnonimaGuardada?.access_token && sesionAnonimaGuardada?.refresh_token) {
      const { data, error } = await supabase.auth.setSession({
        access_token: sesionAnonimaGuardada.access_token,
        refresh_token: sesionAnonimaGuardada.refresh_token,
      });
      if (!error) return data.session;
    }
  }

    const { data, error } = await supabase.auth.signInAnonymously();
    localStorage.setItem("anon_session", JSON.stringify({
      access_token:  data.session!.access_token,
      refresh_token: data.session!.refresh_token,
      user_id:       data.user?.id,
    }));

    if(error) throw error;
    return data.session;
  }

    return{registrarse, iniciarSesion, cerrarSesion, asignarSesionAnonima}
}