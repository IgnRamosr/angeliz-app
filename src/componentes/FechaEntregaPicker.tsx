// componentes/FechaEntregaPicker.tsx
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useMemo } from "react";
import { useDiasBloqueados } from "../hooks/useDisponibility";
import type { Era, FormatLongFnOptions, LocaleDayPeriod, LocalizeFnOptions, Quarter } from "date-fns";

type Props = {
  value?: Date | null;
  onChange: (d: Date | null) => void;
  minDaysFromToday?: number;
};

export default function FechaEntregaPicker({ value, onChange, minDaysFromToday = 0 }: Props) {
  const { estaBloqueado } = useDiasBloqueados();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + minDaysFromToday);
    return d;
  }, [minDaysFromToday]);

  const disabled = [
    { before: today },
    (date: Date) => estaBloqueado(date),
  ];

  // Textos en español
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl border border-pink-200 overflow-hidden">
      <style>{`
        .fecha-picker-custom {
          width: 100%;
        }

        .fecha-picker-custom .rdp {
          --rdp-cell-size: 48px;
          --rdp-accent-color: #ec4899;
          --rdp-background-color: #fce7f3;
          margin: 0;
          width: 100%;
        }
        
        @media (max-width: 640px) {
          .fecha-picker-custom .rdp {
            --rdp-cell-size: 44px;
          }
        }
        
        @media (max-width: 420px) {
          .fecha-picker-custom .rdp {
            --rdp-cell-size: 40px;
          }
        }

        @media (max-width: 380px) {
          .fecha-picker-custom .rdp {
            --rdp-cell-size: 36px;
          }
        }

        .fecha-picker-custom .rdp-months {
          justify-content: center;
          width: 100%;
        }

        .fecha-picker-custom .rdp-month {
          width: 100%;
          max-width: 100%;
        }

        .fecha-picker-custom .rdp-caption {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem 0.5rem 0.75rem;
          margin-bottom: 0.25rem;
        }

        .fecha-picker-custom .rdp-caption_label {
          font-size: 1.05rem;
          font-weight: 700;
          color: #831843;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 640px) {
          .fecha-picker-custom .rdp-caption_label {
            font-size: 0.95rem;
          }
        }

        .fecha-picker-custom .rdp-nav {
          display: flex;
          gap: 0.5rem;
        }

        .fecha-picker-custom .rdp-nav_button {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          transition: all 0.2s;
          background-color: white;
          border: 1px solid #fbcfe8;
        }

        .fecha-picker-custom .rdp-nav_button:hover:not(:disabled) {
          background: linear-gradient(to right, #ec4899, #a855f7);
          border-color: #ec4899;
        }

        .fecha-picker-custom .rdp-nav_button:hover:not(:disabled) svg {
          color: white;
        }

        .fecha-picker-custom .rdp-nav_button svg {
          color: #ec4899;
        }

        .fecha-picker-custom .rdp-nav_button:disabled {
          opacity: 0.3;
        }

        @media (max-width: 640px) {
          .fecha-picker-custom .rdp-nav_button {
            width: 34px;
            height: 34px;
          }
        }

        .fecha-picker-custom .rdp-head_cell {
          font-weight: 700;
          color: #9333ea;
          font-size: 0.8rem;
          text-transform: uppercase;
          padding: 0.6rem 0;
        }

        @media (max-width: 640px) {
          .fecha-picker-custom .rdp-head_cell {
            font-size: 0.75rem;
            padding: 0.5rem 0;
          }
        }

        @media (max-width: 380px) {
          .fecha-picker-custom .rdp-head_cell {
            font-size: 0.7rem;
          }
        }

        .fecha-picker-custom .rdp-cell {
          padding: 1px;
        }

        .fecha-picker-custom .rdp-button {
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.2s;
          border: 2px solid transparent;
          font-size: 1rem;
          width: 100%;
          height: 100%;
        }

        @media (max-width: 640px) {
          .fecha-picker-custom .rdp-button {
            font-size: 0.95rem;
          }
        }

        @media (max-width: 380px) {
          .fecha-picker-custom .rdp-button {
            font-size: 0.9rem;
          }
        }

        .fecha-picker-custom .rdp-button:hover:not(.rdp-day_selected):not(.rdp-day_disabled) {
          background: linear-gradient(to right, #fce7f3, #f3e8ff);
          transform: scale(1.08);
          border-color: #f9a8d4;
          box-shadow: 0 2px 8px rgba(236, 72, 153, 0.2);
        }

        .fecha-picker-custom .rdp-day_selected {
          background: linear-gradient(135deg, #ec4899, #a855f7) !important;
          color: white !important;
          font-weight: 800;
          box-shadow: 0 4px 16px rgba(236, 72, 153, 0.5);
          border-color: transparent !important;
          transform: scale(1.05);
        }

        .fecha-picker-custom .rdp-day_selected:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(236, 72, 153, 0.6);
        }

        .fecha-picker-custom .rdp-day_today:not(.rdp-day_selected) {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          color: #92400e;
          font-weight: 700;
          border: 2px solid #fbbf24;
          box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
        }

        .fecha-picker-custom .rdp-day_disabled {
          background: repeating-linear-gradient(
            45deg,
            #f3f4f6,
            #f3f4f6 4px,
            #e5e7eb 4px,
            #e5e7eb 8px
          ) !important;
          color: #9ca3af !important;
          font-weight: 400;
          opacity: 0.6;
          position: relative;
          cursor: not-allowed !important;
        }

        .fecha-picker-custom .rdp-day_disabled::after {
          content: '✕';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #ef4444;
          font-size: 1.2em;
          font-weight: 700;
        }

        .fecha-picker-custom .rdp-day_disabled:hover {
          transform: none !important;
          box-shadow: none !important;
        }

        .fecha-picker-custom .rdp-day_outside {
          color: #d1d5db;
          opacity: 0.4;
        }

        .fecha-picker-custom .rdp-dropdown {
          padding: 0.45rem 0.7rem;
          border-radius: 8px;
          border: 2px solid #fbcfe8;
          font-size: 0.9rem;
          font-weight: 700;
          margin: 0 0.25rem;
          background-color: white;
          color: #831843;
          transition: all 0.2s;
        }

        .fecha-picker-custom .rdp-dropdown:hover {
          border-color: #ec4899;
          background: linear-gradient(to bottom, #ffffff, #fce7f3);
        }

        .fecha-picker-custom .rdp-dropdown:focus {
          outline: none;
          border-color: #ec4899;
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.15);
        }

        @media (max-width: 640px) {
          .fecha-picker-custom .rdp-dropdown {
            font-size: 0.85rem;
            padding: 0.4rem 0.6rem;
          }
        }

        .fecha-picker-custom .rdp-table {
          width: 100%;
          max-width: 100%;
          border-spacing: 0;
        }

        .fecha-picker-custom .rdp-tbody {
          width: 100%;
        }

        .fecha-picker-custom .rdp-row {
          width: 100%;
        }
      `}</style>
      
      {/* Mostrar fecha seleccionada */}
      {value && (
        <div className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="min-w-0">
                <p className="text-xs opacity-90">Fecha seleccionada</p>
                <p className="font-semibold text-sm sm:text-base truncate">
                  {value.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-white hover:bg-white/20 rounded-lg px-3 py-1.5 text-sm font-medium transition-all flex-shrink-0"
            >
              Limpiar
            </button>
          </div>
        </div>
      )}

      <div className="p-2 sm:p-3 fecha-picker-custom">
        <DayPicker
          mode="single"
          selected={value ?? undefined}
          onSelect={(d) => onChange(d ?? null)}
          disabled={disabled}
          weekStartsOn={1}
          captionLayout="dropdown"
          fromYear={new Date().getFullYear()}
          toYear={new Date().getFullYear() + 2}
          locale={{
            localize: {
              day: (n: number) => diasSemana[n],
              month: (n: number) => meses[n],
              ordinalNumber: function (_value: number, _options?: LocalizeFnOptions): string {
                throw new Error("Function not implemented.");
              },
              era: function (_value: Era, _options?: LocalizeFnOptions): string {
                throw new Error("Function not implemented.");
              },
              quarter: function (_value: Quarter, _options?: LocalizeFnOptions): string {
                throw new Error("Function not implemented.");
              },
              dayPeriod: function (_value: LocaleDayPeriod, _options?: LocalizeFnOptions): string {
                throw new Error("Function not implemented.");
              }
            },
            formatLong: {
              date: () => 'dd/MM/yyyy',
              time: function (_options: FormatLongFnOptions): string {
                throw new Error("Function not implemented.");
              },
              dateTime: function (_options: FormatLongFnOptions): string {
                throw new Error("Function not implemented.");
              }
            },
            code: 'es-ES',
          }}
          labels={{
            labelMonthDropdown: () => 'Mes',
            labelYearDropdown: () => 'Año',
            labelNext: () => 'Mes siguiente',
            labelPrevious: () => 'Mes anterior',
            labelDay: (day, modifiers) => {
              if (modifiers.disabled) return 'Fecha no disponible';
              return `Seleccionar ${day.toLocaleDateString('es-ES')}`;
            },
          }}
          formatters={{
            formatWeekdayName: (day) => {
              const dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
              return dayNames[day.getDay()];
            },
          }}
        />
      </div>

      {/* Leyenda mejorada */}
      <div className="px-4 py-3 bg-white border-t border-pink-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 flex-shrink-0 shadow-sm"></div>
            <span className="text-gray-700 font-medium">Día actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center bg-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #f3f4f6, #f3f4f6 4px, #e5e7eb 4px, #e5e7eb 8px)'
              }}></div>
              <span className="relative text-red-500 font-bold text-xs">✕</span>
            </div>
            <span className="text-gray-700 font-medium">No disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
}