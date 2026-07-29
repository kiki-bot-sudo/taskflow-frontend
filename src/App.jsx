import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { ToastProvider } from "./hooks/useToast";
import { useActivities } from "./hooks/useActivities";
import Hero from "./components/Hero";
import WeekStrip from "./components/WeekStrip";
import ActivityCard from "./components/ActivityCard";
import NewActivityModal from "./components/NewActivityModal";
import EmptyState from "./components/EmptyState";
import Loader from "./components/Loader";
import { cn } from "./lib/cn";
import { fmtFullDate, isToday } from "./lib/date";

const EMPTY_FORM = { title: "", description: "", category: "Estudio", priority: "Normal" };

function AppContent() {
  const [date, setDate] = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const dashRef = useRef(null);

  const { activities, loading, createActivity, addTask, toggleTask, deleteTask } = useActivities(date);

  async function handleCreate() {
    if (!form.title.trim()) return;
    const ok = await createActivity(form, date);
    if (ok) {
      setShowModal(false);
      setForm(EMPTY_FORM);
    }
  }

  function scrollToDash() {
    dashRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const allTasks = activities.flatMap((a) => a.tasks);
  const filters = [
    { value: "all", label: "Todas", count: activities.length },
    { value: "pending", label: "Pendientes", count: activities.filter((a) => !a.isCompleted).length },
    { value: "done", label: "Completadas", count: activities.filter((a) => a.isCompleted).length },
  ];
  const shown =
    filter === "pending" ? activities.filter((a) => !a.isCompleted) : filter === "done" ? activities.filter((a) => a.isCompleted) : activities;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Hero
        activities={activities}
        onVerDia={scrollToDash}
        onNuevaActividad={() => {
          scrollToDash();
          setTimeout(() => setShowModal(true), 500);
        }}
      />

      <section ref={dashRef} className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="mb-10 text-center font-display text-2xl font-bold text-ink">
          <span className="text-thread">—</span> Mi agenda <span className="text-thread">—</span>
        </h2>

        <WeekStrip date={date} setDate={setDate} weekOffset={weekOffset} setWeekOffset={setWeekOffset} />

        <div className="mb-6 text-center">
          <h3 className="font-display text-lg font-bold text-ink capitalize">
            {isToday(date) && <span className="text-thread">Hoy — </span>}
            {fmtFullDate(date)}
          </h3>
          {!loading && (
            <p className="mt-1 font-mono text-xs text-ink-faint">
              {activities.length} actividad{activities.length !== 1 ? "es" : ""} · {allTasks.filter((t) => t.isCompleted).length}/{allTasks.length} tareas
            </p>
          )}
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-1.5">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-bold tracking-wide transition",
                filter === f.value ? "bg-thread text-paper-light" : "border border-line bg-paper-light text-ink-faint hover:border-ink-faint"
              )}
            >
              {f.label} <span className="opacity-60">{f.count}</span>
            </button>
          ))}
        </div>

        <div className="mb-10 flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-thread px-6 py-2.5 text-xs font-bold tracking-wide text-paper-light transition hover:bg-thread-light"
          >
            <Plus size={14} />
            Nueva actividad
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {shown.map((a, i) => (
              <div key={a.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <ActivityCard activity={a} onToggleTask={toggleTask} onDeleteTask={deleteTask} onAddTask={addTask} />
              </div>
            ))}
            {shown.length === 0 && <EmptyState filter={filter} />}
          </div>
        )}
      </section>

      {showModal && (
        <NewActivityModal form={form} setForm={setForm} onClose={() => setShowModal(false)} onSubmit={handleCreate} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
