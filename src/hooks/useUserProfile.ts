import { supabase } from "../supabase/supabaseClient"
import type {ProfileData} from "../assets/types-interfaces/interfaces"
import type { Rol } from "../assets/types-interfaces/types"
import { useEffect, useState } from "react"

// useUserProfile.ts
export const useUserProfile = () => {
  const crearOActualizarPerfil = async (perfil: ProfileData) => {
    const { error } = await supabase
      .from("profiles")
      .upsert(perfil, { onConflict: "id" });

    return { error };
  };

  return { crearOActualizarPerfil };
};





export const useUserRole = () => {

    const [rol, setRol] = useState<Rol>(null);
    const [cargando, setCargando] = useState(true);


    useEffect(() => {
        let desubscribir: (() => void) | undefined;
    
        (async () => {
            try{
                const {data: {user}} = await supabase.auth.getUser();
                if (!user) { setRol(null); return; }

                const{data, error} = await supabase
                .from("profiles")
                .select("tipo")
                .eq("id", user.id)
                .single();

                if(!error && data.tipo) setRol(data.tipo as Rol);
            }
            finally{
                setCargando(false);
            }
        })

        const {data} = supabase.auth.onAuthStateChange(() => {
            setCargando(true);
            supabase.auth.getUser().then(async ({data:{user}}) => {
                if(!user){setRol(null); setCargando(false);}
                const {data} = await supabase.from("profiles").select("tipo").eq("id", user?.id).single();
                setRol((data?.tipo ?? null) as Rol)
                setCargando(false);
            })
        })
        desubscribir = () => data.subscription.unsubscribe();
        return () => {if(desubscribir)desubscribir();}
    }, [])
    
    const esAdmin = rol === "admin";
    return {rol,esAdmin,cargando}
}

