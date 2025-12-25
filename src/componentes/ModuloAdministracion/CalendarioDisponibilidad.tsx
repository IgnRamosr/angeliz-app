import { useEffect, useMemo, useState } from "react";
import { addMonths, buildCalendarGrid, isPast, isToday, startOfMonth, ymd } from "../../utils/fechas";
import { obtenerDisponibilidad, cambiarEstadoDia } from "../../hooks/useDisponibility";
import { ChevronLeft, ChevronRight, CalendarDays, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const WEEKDAYS_FULL = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default function CalendarioDisponibilidad() {
  const [current, setCurrent] = useState(() => startOfMonth(new Date()));
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState<Map<string, boolean>>(new Map());
  const [err, setErr] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const grid = useMemo(() => buildCalendarGrid(current), [current]);
  const inMonth = (d: Date) => d.getMonth() === current.getMonth();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const m = await obtenerDisponibilidad(current.getFullYear(), current.getMonth());
        setMap(m);
      } catch (e: any) {
        setErr(e?.message ?? "Error al cargar disponibilidad");
      } finally {
        setLoading(false);
      }
    })();
  }, [current]);

  const onToggle = async (d: Date) => {
    if (isPast(d)) return;
    if (!inMonth(d)) return;

    const key = ymd(d);
    const prev = map.get(key) ?? false;

    // Optimista
    const next = !prev;
    setMap(new Map(map.set(key, next)));

    try {
      await cambiarEstadoDia(d);
    } catch (e) {
      // revertir si falla
      setMap(new Map(map.set(key, prev)));
      alert("No se pudo cambiar la disponibilidad");
    }
  };

  const headerLabel = current.toLocaleDateString("es-CL", { year: "numeric", month: "long" });

  // Estadísticas
  const stats = useMemo(() => {
    const currentMonth = grid.filter(d => inMonth(d) && !isPast(d));
    const disponibles = currentMonth.filter(d => !(map.get(ymd(d)) ?? false)).length;
    const bloqueados = currentMonth.filter(d => map.get(ymd(d)) ?? false).length;
    return { disponibles, bloqueados, total: currentMonth.length };
  }, [grid, map, current]);

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 capitalize">{headerLabel}</h3>
            <p className="text-sm text-gray-500">Gestiona tu disponibilidad</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrent(addMonths(current, -1))}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-[#6F2521] hover:bg-pink-50 transition-all font-medium text-gray-700 hover:text-[#6F2521]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </button>
          <button
            onClick={() => setCurrent(startOfMonth(new Date()))}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6F2521] to-[#8B3330] text-white font-semibold hover:shadow-lg transition-all"
          >
            Hoy
          </button>
          <button
            onClick={() => setCurrent(addMonths(current, +1))}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-[#6F2521] hover:bg-pink-50 transition-all font-medium text-gray-700 hover:text-[#6F2521]"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Días Disponibles</p>
              <p className="text-3xl font-bold text-green-800 mt-1">{stats.disponibles}</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Días Bloqueados</p>
              <p className="text-3xl font-bold text-red-800 mt-1">{stats.bloqueados}</p>
            </div>
            <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total (Futuro)</p>
              <p className="text-3xl font-bold text-blue-800 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="bg-gradient-to-br from-gray-50 to-purple-50 border-2 border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-[#6F2521]" />
          <p className="font-semibold text-gray-800">Leyenda del calendario</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-green-100 border-2 border-green-400 flex-shrink-0"></div>
            <span className="text-gray-700 font-medium">Disponible para pedidos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-100 border-2 border-red-400 flex-shrink-0"></div>
            <span className="text-gray-700 font-medium">Bloqueado / No disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg border-2 border-blue-500 bg-white flex-shrink-0"></div>
            <span className="text-gray-700 font-medium">Día de hoy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gray-100 border-2 border-gray-300 flex-shrink-0"></div>
            <span className="text-gray-700 font-medium">Día pasado (no editable)</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-3 bg-white/50 rounded-lg p-2">
          💡 <strong>Tip:</strong> Haz clic en cualquier día del mes actual para cambiar su disponibilidad. Los días pasados no se pueden modificar.
        </p>
      </div>

      {/* Error */}
      {err && (
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800">Error al cargar calendario</p>
              <p className="text-sm text-red-600 mt-1">{err}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#6F2521] animate-spin mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Cargando calendario...</p>
          </div>
        </div>
      )}

      {/* Calendario */}
      {!loading && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-lg">
          {/* Cabecera días de semana */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {WEEKDAYS.map((day, idx) => (
              <div
                key={day}
                className="text-center py-3 font-bold text-gray-700 bg-gradient-to-br from-gray-100 to-purple-100 rounded-lg"
              >
                <span className="hidden sm:inline">{WEEKDAYS_FULL[idx]}</span>
                <span className="sm:hidden">{day}</span>
              </div>
            ))}
          </div>

          {/* Grilla de días */}
          <div className="grid grid-cols-7 gap-2">
            {grid.map((d) => {
              const key = ymd(d);
              const bloqueado = map.get(key) ?? false;
              const muted = !inMonth(d);
              const past = isPast(d);
              const today = isToday(d);
              const isHovered = hoveredDate === key;

              const bg = muted
                ? "bg-gray-100 border-gray-300"
                : bloqueado
                  ? "bg-red-100 border-red-400"
                  : "bg-green-100 border-green-400";

              const hoverEffect = !muted && !past ? "hover:scale-105 hover:shadow-lg cursor-pointer" : "";
              const todayRing = today ? "ring-4 ring-blue-500" : "";

              return (
                <button
                  key={key}
                  onClick={() => onToggle(d)}
                  onMouseEnter={() => setHoveredDate(key)}
                  onMouseLeave={() => setHoveredDate(null)}
                  disabled={muted || past}
                  className={`
                    relative h-16 sm:h-20 rounded-xl border-2 flex flex-col items-center justify-center
                    transition-all duration-200 font-semibold
                    ${bg} ${hoverEffect} ${todayRing}
                    ${muted ? "text-gray-400 opacity-50" : "text-gray-800"}
                    ${past && inMonth(d) ? "opacity-60 cursor-not-allowed" : ""}
                  `}
                  title={`${d.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })} - ${bloqueado ? "Bloqueado" : "Disponible"}`}
                >
                  {/* Número del día */}
                  <span className="text-lg sm:text-xl">{d.getDate()}</span>
                  
                  {/* Indicador visual */}
                  {!muted && !past && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                      {bloqueado ? (
                        <XCircle className="w-4 h-4 text-red-600" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  )}

                  {/* Badge "Hoy" */}
                  {today && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                      Hoy
                    </div>
                  )}

                  {/* Tooltip en hover */}
                  {isHovered && !muted && !past && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-10">
                      Clic para {bloqueado ? "disponibilizar" : "bloquear"}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}