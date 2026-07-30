import { ArrowRight, Plus } from "lucide-react";
import { getGreeting } from "../constants";
import { fmtFullDate } from "../lib/date";

export default function Hero({ activities, onVerDia, onNuevaActividad }) {
  const allTasks = activities.flatMap((a) => a.tasks);
  const done = allTasks.filter((t) => t.isCompleted).length;
  const pct = allTasks.length > 0 ? Math.round((done / allTasks.length) * 100) : 0;

  const stats = [
    { label: "Actividades", value: activities.length },
    { label: "Completadas", value: `${done}/${allTasks.length}` },
    { label: "Progreso", value: `${pct}%`, accent: pct === 100 },
  ];

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden border-b border-line px-6 py-24 text-center">
      {/* Ficha con fecha, como un sello de ledger */}
      <p className="mb-8 rounded-full border border-line bg-paper-light px-4 py-1.5 font-mono text-xs font-semibold tracking-widest text-ink-soft uppercase">
        {fmtFullDate(new Date()).toUpperCase()}
      </p>

      <h1 className="font-display text-[clamp(3.5rem,11vw,8rem)] leading-[0.92] font-black tracking-[-0.03em] text-ink text-balance">
        TASK<span className="text-thread">FLOW</span>
      </h1>

      <p className="mt-6 font-display text-[clamp(1.35rem,3vw,2rem)] font-medium text-ink-soft">
        {getGreeting()}
      </p>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onVerDia}
          className="group inline-flex items-center gap-2 rounded-full bg-thread px-8 py-4 text-sm font-bold tracking-wide text-paper-light shadow-card transition hover:bg-thread-light hover:shadow-card-hover"
        >
          Ver mi día
          <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
        </button>
        <button
          onClick={onNuevaActividad}
          className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-transparent px-8 py-4 text-sm font-bold text-ink transition hover:border-thread hover:text-thread"
        >
          <Plus size={16} />
          Nueva actividad
        </button>
      </div>

      {/* Puntada divisoria */}
      <div className="stitch-divider mt-16 w-full max-w-md" />

      <div className="mt-10 flex flex-wrap items-center justify-center gap-10 sm:gap-16">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className={`font-mono text-[clamp(2rem,5vw,3.25rem)] font-bold ${s.accent ? "text-done" : "text-ink"}`}>
              {s.value}
            </p>
            <p className="mt-1 text-[11px] font-semibold tracking-widest text-ink-faint uppercase">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
