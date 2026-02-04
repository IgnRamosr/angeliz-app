    // Devuelve "YYYY-MM-DD" en zona local (ideal para columnas DATE)
    export function ymd(date: Date): string {
    // Ajuste a medianoche local para evitar desfases por timezone
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
    }

    export function startOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    export function endOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
    }
    export function addMonths(d: Date, delta: number) {
    return new Date(d.getFullYear(), d.getMonth() + delta, 1);
    }

    // Genera la grilla del calendario: semanas completas (dom-sáb)
    export function buildCalendarGrid(current: Date): Date[] {
    const first = startOfMonth(current);
    const last = endOfMonth(current);

    // JS: 0=Domingo ... 6=Sábado
    const offset = first.getDay(); // días a retroceder para comenzar en domingo
    const startGrid = new Date(first);
    startGrid.setDate(first.getDate() - offset);

    const days: Date[] = [];
    // 6 filas x 7 columnas = 42 celdas (cubre cualquier mes)
    for (let i = 0; i < 42; i++) {
        const d = new Date(startGrid);
        d.setDate(startGrid.getDate() + i);
        days.push(d);
    }
    return days;
    }

    export function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
    }

    export function isToday(d: Date) {
    return isSameDay(d, new Date());
    }

    export function isPast(d: Date) {
    const t = new Date(); // hoy
    const cmp = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const todayMid = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    return cmp < todayMid;
    }

    export function toKey(d: Date | string) {
    const dt = typeof d === "string" ? new Date(d) : d;
    // normalizamos a fecha “local” pero dejamos la key en YYYY-MM-DD
    const y = dt.getFullYear();
    const m = `${dt.getMonth() + 1}`.padStart(2, "0");
    const day = `${dt.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export function toLocalISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // "2025-11-19"
}


    // Alternativa más compacta si prefieres un formato más corto
    export const formatearFechaHoraCorta = (fechaString: string): string => {
        try {
            const fecha = new Date(fechaString);
            
            if (isNaN(fecha.getTime())) {
                return fechaString;
            }

            const dia = fecha.getDate().toString().padStart(2, '0');
            const mes = fecha.getMonth() + 1;
            const año = fecha.getFullYear();
            const horas = fecha.getHours().toString().padStart(2, '0');
            const minutos = fecha.getMinutes().toString().padStart(2, '0');

            const meses = [
                'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
            ];

            return `${dia} ${meses[mes - 1]} ${año}, ${horas}:${minutos}`;
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return fechaString;
        }
    };