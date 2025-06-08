import { supabase } from "../supabase/supabaseClient"

interface ProfileData{
    id: string
    nombre: string
    apellido: string
    telefono: string
}

export const useUserProfile = () =>{
    const crearPerfil = async (perfil: ProfileData) =>{
        return await supabase.from('profiles').insert([perfil])
    }
    return {crearPerfil}
}