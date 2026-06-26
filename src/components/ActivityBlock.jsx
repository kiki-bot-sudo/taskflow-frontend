import { useState } from "react";
import { GOLD, BG, SURFACE, SURFACE2, BORDER, TEXT, MUTED, PRIORITY, getCat, daysUntil, countdownLabel } from "../constants";

export default function ActivityBlock({ a, onToggleTask, onDeleteTask, onAddTask }) {
  const [addOpen, setAddOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDue, setTaskDue] = useState("");

  const p    = PRIORITY[a.priority] || PRIORITY.Normal;
  const cat  = getCat(a.category);
  const done = a.tasks.filter(t => t.isCompleted).length;
  const total = a.tasks.length;
  const pct  = total > 0 ? Math.round(done / total * 100) : 0;

  const handleAdd = () => {
    if (!taskTitle.trim()) return;
    onAddTask(a.id, taskTitle, taskDue || null);
    setTaskTitle(""); setTaskDue(""); setAddOpen(false);
  };

  return (
    <div style={{
      background: SURFACE, border: `1px solid ${BORDER}`,
      borderRadius: 16, overflow: "hidden",
      transition: "transform .2s, box-shadow .2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>

      {/* Barra de color superior */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${p.color}, ${cat.color})` }} />

      <div style={{ padding: "1.25rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: cat.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
            {cat.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px", color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textDecoration: a.isCompleted ? "line-through" : "none", opacity: a.isCompleted ? .6 : 1 }}>
              {a.title}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 99, background: p.color + "22", color: p.color }}>
                {p.label}
              </span>
              {a.category && <span style={{ fontSize: 11, color: MUTED }}>{a.category}</span>}
            </div>
          </div>
          {/* % badge */}
          <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 12, background: SURFACE2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: pct === 100 ? "#2ED573" : GOLD }}>{pct}%</span>
          </div>
        </div>

        {/* Barra de progreso */}
        {total > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: MUTED }}>{done} de {total} tareas</span>
              {a.isCompleted && <span style={{ fontSize: 11, color: "#2ED573", fontWeight: 600 }}>✓ Completada</span>}
            </div>
            <div style={{ height: 6, background: SURFACE2, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${p.color},${cat.color})`, borderRadius: 99, transition: "width .5s ease" }} />
            </div>
          </div>
        )}

        {/* Tareas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {a.tasks.map(t => {
            const dl = t.dueTime ? daysUntil(t.dueTime) : null;
            const cl = dl !== null ? countdownLabel(dl) : null;
            return (
              <div key={t.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = SURFACE2}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div onClick={() => onToggleTask(a.id, t)} style={{
                    width: 18, height: 18, borderRadius: 5,
                    border: `2px solid ${t.isCompleted ? p.color : BORDER}`,
                    background: t.isCompleted ? p.color : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, cursor: "pointer", transition: "all .2s",
                  }}>
                    {t.isCompleted && <span style={{ color: BG, fontSize: 11, fontWeight: 900 }}>✓</span>}
                  </div>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: t.isCompleted ? MUTED : TEXT, textDecoration: t.isCompleted ? "line-through" : "none" }}>
                    {t.title}
                  </span>
                  {t.isCompleted && (
                    <button onClick={() => onDeleteTask(a.id, t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#333", fontSize: 18, padding: "0 4px", transition: "color .2s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#FF4757"}
                      onMouseLeave={e => e.currentTarget.style.color = "#333"}>×</button>
                  )}
                </div>

                {/* Countdown banner */}
                {!t.isCompleted && cl && (
                  <div style={{ marginLeft: 38, marginBottom: 4, padding: "5px 10px", borderRadius: 8, background: cl.color + "18", borderLeft: `3px solid ${cl.color}` }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: cl.color }}>⏱ {cl.text}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Agregar tarea */}
        {addOpen ? (
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} autoFocus
              onKeyDown={e => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setAddOpen(false); }}
              placeholder="Nombre de la tarea..."
              style={{ background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT, padding: "9px 12px", borderRadius: 10, fontSize: 13, fontFamily: "inherit", outline: "none", width: "100%" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <input type="date" value={taskDue} onChange={e => setTaskDue(e.target.value)}
                style={{ flex: 1, background: SURFACE2, border: `1px solid ${BORDER}`, color: TEXT, padding: "9px 12px", borderRadius: 10, fontSize: 13, fontFamily: "inherit", outline: "none", colorScheme: "dark" }} />
              <button onClick={handleAdd} style={{ background: GOLD, color: BG, border: "none", padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                + Agregar
              </button>
              <button onClick={() => setAddOpen(false)} style={{ background: "none", border: `1px solid ${BORDER}`, color: MUTED, padding: "9px 12px", borderRadius: 10, fontSize: 13, cursor: "pointer" }}>
                ✕
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAddOpen(true)} style={{
            marginTop: 10, width: "100%", background: "none",
            border: `1px dashed ${BORDER}`, color: MUTED,
            padding: "9px", borderRadius: 10, fontSize: 12,
            fontWeight: 600, cursor: "pointer", transition: "all .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}>
            + Agregar tarea
          </button>
        )}
      </div>
    </div>
  );
}