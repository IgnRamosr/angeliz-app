import { supabase } from "../supabase/supabaseClient"
import type {ProfileData} from "../assets/types-interfaces/interfaces"

export const useUserProfile = () =>{
    const crearPerfil = async (perfil: ProfileData) =>{
        return await supabase.from('profiles').insert([perfil])
    }
    return {crearPerfil}
}