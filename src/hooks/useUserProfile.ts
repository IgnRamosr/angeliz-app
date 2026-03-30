//Funciones para crear o actualizar el perfil y traer el rol de este


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
        const cargarRol = async (userId: string | undefined) => {
            if (!userId) {
                setRol(null);
                setCargando(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("tipo")
                    .eq("id", userId)
                    .single();

                if (!error && data?.tipo) setRol(data.tipo as Rol);
                else setRol(null);
            } finally {
                setCargando(false);
            }
        };

        // Carga inicial
        supabase.auth.getUser().then(({ data: { user } }) => {
            cargarRol(user?.id);
        });

        // Reacciona a cambios de sesión
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                setCargando(true); // importante: vuelve a indicar que está cargando
                cargarRol(session?.user?.id);
            }
            if (event === 'SIGNED_OUT') {
                setRol(null);
                setCargando(false);
            }
        });

        return () => data.subscription.unsubscribe();
    }, []);

    const esAdmin = rol === "admin";
    return { rol, esAdmin, cargando };
};