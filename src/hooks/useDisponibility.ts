
//Funciones para interactuar con la disponibilidad(Solo lo puede hacer el administrador)

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { toKey, ymd } from "../utils/fechas";
import { obtenerUsuario } from "./useCheckoutFunction";





export const obtenerDisponibilidad = async (año: number, mes0: number) => {
    // mes0: 0=Enero ... 11=Diciembre
    const ini = new Date(año, mes0, 1);
    const fin = new Date(año, mes0 + 1, 0);

    const {data,error} = await  supabase.from("disponibilidad").select("fecha,bloqueado").gte("fecha",ymd(ini)).lte("fecha",ymd(fin));
    if (error) throw error;

    // Map rápido: "YYYY-MM-DD" -> boolean
    const map = new Map<string, boolean>();
    for (const row of data ?? []) {
    map.set(row.fecha as string, !!row.bloqueado);
    }
    return map;


}

    /** Toggle atómico: inserta si no existe, o invierte bloqueado si existe */
    export async function cambiarEstadoDia(fecha: Date) {
    const f = ymd(fecha);

    const usuarioId =await obtenerUsuario();

    // Leemos estado actual
    const { data, error: error1 } = await supabase
        .from("disponibilidad")
        .select("bloqueado")
        .eq("fecha", f)
        .maybeSingle();

    if (error1) throw error1;

    const nuevo = !(data?.bloqueado ?? false); // si no existe, lo creamos DESBLOQUEADO (invirtiendo true)


    // upsert sobre PK (fecha)
    const { error: error2 } = await supabase
        .from("disponibilidad")
        .upsert(
        [{fecha: f,actualizado_por: usuarioId, bloqueado: nuevo }],
        { onConflict: "fecha" }
        );

    if (error2) throw error2;

    return nuevo; // devuelve el nuevo estado
    }



export function useDiasBloqueados() {
  const [setFechas, setSetFechas] = useState<Set<string>>(new Set());
  const fetchedOnce = useRef(false);

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    (async () => {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("disponibilidad") // o "disponibilidad" con .eq("bloqueado", true)
        .select("fecha")
        .eq("bloqueado", true);

      if (!error && data) {
        const s = new Set<string>(data.map((r: { fecha: string }) => toKey(r.fecha)));
        setSetFechas(s);
      }
    })();
  }, []);

  // Helper boolean para el componente
  const estaBloqueado = useMemo(
    () => (d: Date) => setFechas.has(toKey(d)),
    [setFechas]
  );

  return { setFechas, estaBloqueado };
}