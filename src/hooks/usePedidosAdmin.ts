// src/hooks/usePedidosAdmin.ts
import { useEffect, useState } from "react";
import { listarPedidosResumenAdmin } from "../hooks/useOrders"; // o donde lo tengas
import type { PedidoResumen } from "../assets/types-interfaces/types";

export function usePedidosAdmin() {
  const [data, setData] = useState<PedidoResumen[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        setCargando(true);
        const pedidos = await listarPedidosResumenAdmin();
        if (vivo) setData(pedidos as PedidoResumen[]);
      } catch (e: any) {
        if (vivo) setError(e?.message ?? "Error al cargar pedidos");
      } finally {
        if (vivo) setCargando(false);
      }
    })();
    return () => { vivo = false; };
  }, []);

  return { data, cargando, error };
}
