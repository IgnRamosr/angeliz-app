import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import type { Session } from "@supabase/supabase-js";


const useUserSession = () => {

    const [sesion, setSesion] = useState<Session | null>(null)

    useEffect(() => {

        void supabase.auth.getSession().then(({data}) => {
            setSesion(data.session);
        });

        const {data} = supabase.auth.onAuthStateChange((_event, newSession) => {setSesion(newSession)})

        return () => {data.subscription.unsubscribe();}

    }, [])
    
return sesion;
}

export default useUserSession