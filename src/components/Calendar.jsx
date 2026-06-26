import { GOLD, BG, SURFACE, BORDER, TEXT, MUTED, DAY_NAMES, MONTH_NAMES, sameDay, getWeekDays } from "../constants";

export default function Calendar({ date, setDate, weekOffset, setWeekOffset }) {
  const today = new Date();
  const refDate = new Date(today);
  refDate.setDate(today.getDate() + weekOffset * 7);
  const weekDays = getWeekDays(refDate);

  return (
    <div style={{ marginBottom: 40 }}>

      {/* Header con navegación */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: MUTED, fontWeight: 600, letterSpacing: ".1em" }}>
          {MONTH_NAMES[weekDays[0].getMonth()].toUpperCase()} {weekDays[0].getFullYear()}
          {weekDays[6].getMonth() !== weekDays[0].getMonth() &&
            ` — ${MONTH_NAMES[weekDays[6].getMonth()].toUpperCase()}`}
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setWeekOffset(p => p - 1)} style={{
            background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT,
            width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>‹</button>
          <button onClick={() => { setWeekOffset(0); setDate(new Date()); }} style={{
            background: SURFACE, border: `1px solid ${GOLD}44`, color: GOLD,
            padding: "0 16px", height: 36, borderRadius: 10, cursor: "pointer",
            fontSize: 12, fontWeight: 700, letterSpacing: ".05em",
          }}>HOY</button>
          <button onClick={() => setWeekOffset(p => p + 1)} style={{
            background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT,
            width: 36, height: 36, borderRadius: 10, cursor: "pointer", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>›</button>
        </div>
      </div>

      {/* Días de la semana */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
        {weekDays.map(d => {
          const sel  = sameDay(d, date);
          const tod  = sameDay(d, today);
          const past = d < today && !tod;

          return (
            <button key={d.toISOString()} onClick={() => setDate(new Date(d))} style={{
              background: sel ? GOLD : SURFACE,
              border: tod && !sel ? `1.5px solid ${GOLD}55` : `1px solid ${BORDER}`,
              borderRadius: 12, padding: "12px 6px",
              cursor: "pointer", transition: "all .2s", textAlign: "center",
            }}
              onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = GOLD; }}
              onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = tod ? `${GOLD}55` : BORDER; }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", color: sel ? BG : MUTED, marginBottom: 6 }}>
                {DAY_NAMES[d.getDay()]}
              </p>
              <p style={{ fontSize: 20, fontWeight: 800, color: sel ? BG : past ? MUTED : TEXT, margin: 0 }}>
                {d.getDate()}
              </p>
              {tod && !sel && (
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: GOLD, margin: "6px auto 0" }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}