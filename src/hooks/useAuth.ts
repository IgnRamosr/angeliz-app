//FUNCIONES PARA EL REGISTRO / AUTENTICACIÓN DEL USUARIO

import { supabase } from "../supabase/supabaseClient";
import type { ParametrosAutenticacion } from "../assets/types-interfaces/interfaces";

export const useAutenticacion = () => {
  // Detecta si la sesión actual es anónima
  const esAnonimoActual = async () => {
    const { data } = await supabase.auth.getUser();
    const u = data.user;
    return !!u && ((u as any).is_anonymous ?? u?.app_metadata?.provider === "anon");
  };

  /**
   * Registro “inteligente”:
   * - Si NO hay usuario o no es anónimo → signUp
   * - Si HAY usuario anónimo → updateUser (promover)
   */
  const registrarse = async ({ email, password }: ParametrosAutenticacion) => {
    const anon = await esAnonimoActual();

    if (anon) {
      // Promueve la sesión anónima a email+password
      const res = await supabase.auth.updateUser({ email, password });
      return res; // { data, error }
    } else {
      // Registro normal
      const res = await supabase.auth.signUp({ email, password });
      return res; // { data, error }
    }
  };

  // Si alguna vez necesitas forzar explícitamente la promoción
  const promoverAnonimo = async ({ email, password }: ParametrosAutenticacion) => {
    return await supabase.auth.updateUser({ email, password });
  };

  const iniciarSesion = async ({ email, password }: ParametrosAutenticacion) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();

    const sesionAnonima = localStorage.getItem("anon_session");
    if (sesionAnonima) {
      const s = JSON.parse(sesionAnonima);
      if (s?.access_token && s?.refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token: s.access_token,
          refresh_token: s.refresh_token,
        });
        if (!error) return;
      }
    }

    // Si tu SDK tiene esta función disponible:
    if (typeof supabase.auth.signInAnonymously === "function") {
      await supabase.auth.signInAnonymously();
    }
  };

  const asignarSesionAnonima = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) return session;

    const guardada = localStorage.getItem("anon_session");
    if (guardada) {
      const s = JSON.parse(guardada);
      if (s?.access_token && s?.refresh_token) {
        const { data, error } = await supabase.auth.setSession({
          access_token: s.access_token,
          refresh_token: s.refresh_token,
        });
        if (!error) return data.session;
      }
    }

    // Crear nueva sesión anónima (si está disponible en tu versión del SDK)
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;

    localStorage.setItem(
      "anon_session",
      JSON.stringify({
        access_token: data.session!.access_token,
        refresh_token: data.session!.refresh_token,
        user_id: data.user?.id,
      })
    );

    return data.session;
  };

  return { registrarse, promoverAnonimo, iniciarSesion, cerrarSesion, asignarSesionAnonima };
};
