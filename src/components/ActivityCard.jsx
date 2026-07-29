import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { getCat, PRIORITY } from "../constants";
import { cn } from "../lib/cn";
import { countdownLabel, daysUntil } from "../lib/date";

const TONE_TEXT = { high: "text-thread", normal: "text-priority-normal", low: "text-done" };
const TONE_BG = { high: "bg-thread-soft", normal: "bg-priority-normal/15", low: "bg-done-soft" };
const TONE_BORDER = { high: "var(--color-thread)", normal: "var(--color-priority-normal)", low: "var(--color-done)" };

export default function ActivityCard({ activity, onToggleTask, onDeleteTask, onAddTask }) {
  const [addOpen, setAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");

  const priority = PRIORITY[activity.priority] || PRIORITY.Normal;
  const cat = getCat(activity.category);
  const done = activity.tasks.filter((t) => t.isCompleted).length;
  const total = activity.tasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  function submitTask() {
    if (!title.trim()) return;
    onAddTask(activity.id, title, due || null);
    setTitle("");
    setDue("");
    setAddOpen(false);
  }

  return (
    <article className="group/card flex overflow-hidden rounded-xl border border-line bg-paper-light shadow-card transition hover:shadow-card-hover">
      {/* Tab de categoría, como el borde de un fólder */}
      <div className="w-1.5 shrink-0" style={{ background: cat.color }} />

      <div className="flex-1 p-5">
        <header className="mb-4 flex items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
            style={{ background: `color-mix(in srgb, ${cat.color} 18%, transparent)` }}
          >
            {cat.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className={cn(
                "truncate font-display text-base font-semibold text-ink",
                activity.isCompleted && "text-ink-faint line-through decoration-2"
              )}
            >
              {activity.title}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                style={{ background: `color-mix(in srgb, ${priority.color} 18%, transparent)`, color: priority.color }}
              >
                {priority.label}
              </span>
              {activity.category && <span className="text-[11px] text-ink-faint">{activity.category}</span>}
            </div>
          </div>
          {total > 0 && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-paper font-mono">
              <span className={cn("text-sm font-bold", pct === 100 ? "text-done" : "text-thread")}>{pct}%</span>
            </div>
          )}
        </header>

        {total > 0 && (
          <div className="mb-4">
            <div className="mb-1.5 flex justify-between text-[11px] text-ink-faint">
              <span>
                {done} de {total} tareas
              </span>
              {activity.isCompleted && <span className="font-semibold text-done">Completada</span>}
            </div>
            <div className="stitch-divider relative h-[3px] w-full">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-thread transition-all duration-500"
                style={{ width: `${pct}%`, background: pct === 100 ? "var(--color-done)" : undefined }}
              />
            </div>
          </div>
        )}

        <ul className="flex flex-col gap-0.5">
          {activity.tasks.map((t) => {
            const days = t.dueTime ? daysUntil(t.dueTime) : null;
            const countdown = days !== null ? countdownLabel(days) : null;
            return (
              <li key={t.id}>
                <div className="group flex items-center gap-2.5 rounded-lg px-2 py-2 transition hover:bg-paper">
                  <button
                    aria-label={t.isCompleted ? "Marcar como pendiente" : "Marcar como hecha"}
                    onClick={() => onToggleTask(activity.id, t)}
                    className={cn(
                      "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition",
                      t.isCompleted ? "border-thread bg-thread" : "border-ink-faint/60 bg-transparent"
                    )}
                  >
                    {t.isCompleted && <Check size={11} strokeWidth={3.5} className="text-paper-light" />}
                  </button>
                  <span
                    className={cn(
                      "flex-1 text-[13px] font-medium text-ink",
                      t.isCompleted && "text-ink-faint line-through"
                    )}
                  >
                    {t.title}
                  </span>
                  <button
                    aria-label={`Eliminar tarea ${t.title}`}
                    onClick={() => {
                      if (window.confirm(`¿Eliminar tarea "${t.title}"?`)) onDeleteTask(activity.id, t.id);
                    }}
                    className="rounded p-1 text-ink-faint opacity-0 transition hover:text-thread focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <X size={15} />
                  </button>
                </div>
                {!t.isCompleted && countdown && (
                  <div className={cn("mb-1 ml-9 rounded-md border-l-2 px-2.5 py-1", TONE_BG[countdown.tone])} style={{ borderColor: TONE_BORDER[countdown.tone] }}>
                    <span className={cn("text-[11px] font-semibold", TONE_TEXT[countdown.tone])}>{countdown.text}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {addOpen ? (
          <div className="mt-2 flex flex-col gap-2">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitTask();
                if (e.key === "Escape") setAddOpen(false);
              }}
              placeholder="Nombre de la tarea…"
              className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-thread"
            />
            <div className="flex gap-2">
              <input
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className="flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-[13px] text-ink outline-none focus:border-thread"
              />
              <button onClick={submitTask} className="rounded-lg bg-thread px-4 text-[13px] font-bold text-paper-light transition hover:bg-thread-light">
                Agregar
              </button>
              <button onClick={() => setAddOpen(false)} className="rounded-lg border border-line px-3 text-ink-faint transition hover:border-thread hover:text-thread">
                <X size={15} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddOpen(true)}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-line py-2 text-xs font-semibold text-ink-faint transition hover:border-thread hover:text-thread"
          >
            <Plus size={13} />
            Agregar tarea
          </button>
        )}
      </div>
    </article>
  );
}
