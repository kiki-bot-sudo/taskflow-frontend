import fs from 'fs';

const newContent = `import { useState, useEffect, useCallback, useRef } from "react";
import { ToastProvider, useToast } from "./hooks/useToast";
import Hero from "./components/Hero";
import Calendar from "./components/Calendar";
import ActivityBlock from "./components/ActivityBlock";
import { BASE, BG, SURFACE, SURFACE2, BORDER, TEXT, MUTED, GOLD, GOLD2, CATS, sameDay } from "./constants";

const inp = {
  background: SURFACE2, border: \`1px solid ${BORDER}\`, color: TEXT,
  padding: "12px 14px", borderRadius: 12, fontSize: 14,
  fontFamily: "inherit", outline: "none", width: "100%",
};

function AppContent() {
  const [date, setDate]             = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const [activities, setActs]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("all");
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState({ title: "", description: "", category: "Estudio", priority: "Normal" });
  const dashRef = useRef(null);
  const today   = new Date();
  const { showToast } = useToast();

  const load = useCallback(async d => {
    setLoading(true);
    try {
      const iso = \`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}\`;
      const url = sameDay(d, today) ? \`${BASE}/activity/today\` : \`${BASE}/activity/date/${iso}\`;
      const acts = await fetch(url).then(r => r.json());
      const full = await Promise.all(
        (Array.isArray(acts) ? acts : []).map(async a => ({
          ...a, tasks: await fetch(\`${BASE}/activity/${a.id}/task\`).then(r => r.json())
        }))
      );
      setActs(full);
    } catch { setActs([]); }
    setLoading(false);
  }, []);

  useEffect(() => { load(date); }, [date, load]);

  async function crearActividad() {
    if (!form.title.trim()) return;
    try {
      const d = new Date(date); d.setHours(12, 0, 0, 0);
      const a = await fetch(\`${BASE}/activity\`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, date: d.toISOString() }),
      }).then(r => r.json());
      setActs(p => [...p, { ...a, tasks: [] }]);
      setShowModal(false);
      setForm({ title: "", description: "", category: "Estudio", priority: "Normal" });
      showToast("✓ Actividad creada", "success");
    } catch { showToast("Error al crear", "error"); }
  }

  async function onAddTask(actId, title, dueTime) {
    try {
      const t = await fetch(\`${BASE}/activity/${actId}/task\`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: "", dueTime: dueTime ? new Date(dueTime).toISOString() : null }),
      }).then(r => r.json());
      setActs(p => p.map(a => a.id !== actId ? a : { ...a, tasks: [...a.tasks, t] }));
      showToast(dueTime ? "⏱ Tarea con deadline agregada" : "✓ Tarea agregada", "success");
    } catch { showToast("Error al agregar tarea", "error"); }
  }

  async function onToggleTask(actId, tarea) {
    try {
      const upd = await fetch(\`${BASE}/activity/${actId}/task/${tarea.id}\`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: tarea.id,
          activityId: actId,
          title: tarea.title,
          description: tarea.description,
          isCompleted: !tarea.isCompleted,
          dueTime: tarea.dueTime
        }),
      }).then(r => r.json());
      setActs(p => p.map(a => {
        if (a.id !== actId) return a;
        const tasks = a.tasks.map(t => t.id === tarea.id ? upd : t);
        const done  = tasks.length > 0 && tasks.every(t => t.isCompleted);
        if (done && !a.isCompleted) showToast("🎉 ¡Actividad completada!", "success");
        return { ...a, tasks, isCompleted: done };
      }));
    } catch {}
  }

  async function onDeleteTask(actId, tid) {
    try {
      await fetch(\`${BASE}/activity/${actId}/task/${tid}\`, { method: "DELETE" });
      setActs(p => p.map(a => a.id !== actId ? a : { ...a, tasks: a.tasks.filter(t => t.id !== tid) }));
      showToast("Tarea eliminada", "info");
    } catch {}
  }

  const shown = filter === "pending" ? activities.filter(a => !a.isCompleted)
              : filter === "done"    ? activities.filter(a => a.isCompleted)
              : activities;

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: "'Inter',system-ui,sans-serif" }}>
      <style>{\`
        @keyframes slideUp { from { transform: translateX(-50%) translateY(20px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn   { from { transform: scale(.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes spin    { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(1); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 99px; }
      \`}</style>

      {/* Hero */}
      <Hero
        activities={activities}
        onVerDia={() => dashRef.current?.scrollIntoView({ behavior: "smooth" })}
        onNuevaActividad={() => {
          dashRef.current?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => setShowModal(true), 600);
        }}
      />

      {/* Dashboard */}
      <section ref={dashRef} style={{ padding: "4rem 5vw" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 32, textAlign: "center" }}>
            <span style={{ color: GOLD }}>—</span> MI AGENDA <span style={{ color: GOLD }}>—</span>
          </h2>

          {/* Calendario */}
          <Calendar
            date={date} setDate={setDate}
            weekOffset={weekOffset} setWeekOffset={setWeekOffset}
          />

          {/* Día seleccionado — centrado */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800 }}>
              {sameDay(date, today) ? "HOY — " : ""}
              {date.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" }).toUpperCase()}
            </h3>
            {!loading && (
              <p style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>
                {activities.length} actividad{activities.length !== 1 ? "es" : ""} · {activities.flatMap(a=>a.tasks).filter(t=>t.isCompleted).length}/{activities.flatMap(a=>a.tasks).length} tareas
              </p>
            )}
          </div>

          {/* Filtros — centrados */}
          <div style={{ display: "flex", gap: 6, marginBottom: 24, justifyContent: "center" }}>
            {["all","Todas",activities.length],["pending","Pendientes",activities.filter(a=>!a.isCompleted).length],["done","Completadas",activities.filter(a=>a.isCompleted).length]].map(([v,l,c]) => (
              <button key={v} onClick={() => setFilter(v)} style={{
                padding: "8px 18px", borderRadius: 99, fontSize: 12, fontWeight: 700,
                cursor: "pointer", letterSpacing: ".04em", transition: "all .2s",
                background: filter === v ? GOLD : SURFACE,
                color: filter === v ? BG : MUTED,
                border: filter === v ? "none" : \`1px solid ${BORDER}\`,
              }}>{l} <span style={{ opacity: .5 }}>{c}</span></button>
            ))}
          </div>

          {/* Botón nueva actividad centrado */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <button onClick={() => setShowModal(true)} style={{ background: GOLD, color: BG, border: "none", padding: "11px 28px", borderRadius: 12, fontSize: 13, fontWeight: 800, cursor: "pointer", letterSpacing: ".04em" }}
              onMouseEnter={e => e.currentTarget.style.background = GOLD2}
              onMouseLeave={e => e.currentTarget.style.background = GOLD}>
              + NUEVA ACTIVIDAD
            </button>
          </div>

          {/* Spinner */}
          {loading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
              <div style={{ width: 36, height: 36, border: \`3px solid ${BORDER}\`, borderTopColor: GOLD, borderRadius: "50%", animation: "spin .7s linear infinite" }} />
            </div>
          )}

          {/* Grid de bloques */}
          {!loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
              {shown.map((a, i) => (
                <div key={a.id} style={{ animation: \`fadeIn .3s ease ${i * .06}s both\` }}>
                  <ActivityBlock
                    a={a}
                    onToggleTask={onToggleTask}
                    onDeleteTask={onDeleteTask}
                    onAddTask={onAddTask}
                  />
                </div>
              ))}
              {shown.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "5rem 0" }}>
                  <p style={{ fontSize: 48, marginBottom: 16 }}>{filter === "done" ? "🎯" : "📋"}</p>
                  <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                    {filter === "done" ? "Nada completado aún" : "Sin actividades"}
                  </p>
                  <p style={{ fontSize: 13, color: MUTED }}>Agrega tu primera actividad del día</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Modal nueva actividad */}
      {showModal && (
        <div onClick={e => e.target === e.currentTarget && setShowModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(8px)" }}>
          <div style={{ background: SURFACE, border: \`1px solid ${BORDER}\`, borderRadius: 24, padding: "2rem", width: 440, animation: "popIn .2s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>Nueva actividad</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: MUTED, fontSize: 24, cursor: "pointer" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input placeholder="Título *" value={form.title} style={inp} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} onKeyDown={e => e.key === "Enter" && crearActividad()} />
              <input placeholder="Descripción" value={form.description} style={inp} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ ...inp, appearance: "auto" }}>
                  {Object.keys(CATS).map(k => <option key={k}>{k}</option>)}
                </select>
                <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} style={{ ...inp, appearance: "auto" }}>
                  <option value="High">🔴 Alta</option>
                  <option value="Normal">🟡 Normal</option>
                  <option value="Low">🟢 Baja</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: "13px", borderRadius: 14, border: \`1px solid ${BORDER}\`, background: "none", fontSize: 14, cursor: "pointer", color: MUTED }}>Cancelar</button>
                <button onClick={crearActividad} style={{ flex: 2, padding: "13px", borderRadius: 14, border: "none", background: GOLD, color: BG, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>CREAR</button>
              </div>
            </div>
          </div>
        </div>
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
}`;

fs.writeFileSync('src/App.jsx', newContent);
console.log('App.jsx written successfully');