import { getGreeting, GOLD, BG, GOLD2, BORDER, MUTED, TEXT } from "../constants";

export default function Hero({ activities, onVerDia, onNuevaActividad }) {
  const allT  = activities.flatMap(a => a.tasks);
  const doneT = allT.filter(t => t.isCompleted).length;
  const pct   = allT.length > 0 ? Math.round(doneT / allT.length * 100) : 0;

  return (
    <>
      {/* Fecha fija arriba izquierda */}
      <p style={{ position:"absolute", top:28, left:"6vw", fontSize:12, fontWeight:700, letterSpacing:".2em", color:GOLD, textTransform:"uppercase", zIndex:10 }}>
        {new Date().toLocaleDateString("es-MX", { weekday:"long", day:"numeric", month:"long", year:"numeric" }).toUpperCase()}
      </p>

      <section style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "0 6vw",
        position: "relative",
        borderBottom: `1px solid ${BORDER}`,
      }}>
        {/* Glow */}
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% 50%, ${GOLD}0A 0%, transparent 60%)`, pointerEvents:"none" }} />

        {/* TASKFLOW */}
        <h1 style={{ fontSize:"clamp(64px,10vw,130px)", fontWeight:900, lineHeight:.9, letterSpacing:"-.03em", marginBottom:16 }}>
          <span style={{ color:TEXT }}>TASK</span><span style={{ color:GOLD }}>FLOW</span>
        </h1>

        {/* Saludo */}
        <p style={{ fontSize:"clamp(20px,3vw,40px)", fontWeight:800, color:TEXT, marginBottom:52, letterSpacing:"-.01em" }}>
          {getGreeting()}
        </p>

        {/* Botones */}
        <div style={{ display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center" }}>
          <button onClick={onVerDia} style={{ background:GOLD, color:BG, border:"none", padding:"16px 40px", borderRadius:99, fontSize:15, fontWeight:800, cursor:"pointer", letterSpacing:".04em", transition:"all .2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.background=GOLD2; e.currentTarget.style.transform="scale(1.04)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background=GOLD; e.currentTarget.style.transform="none"; }}>
            VER MI DÍA →
          </button>
          <button onClick={onNuevaActividad} style={{ background:"none", color:TEXT, border:`1.5px solid ${BORDER}`, padding:"16px 40px", borderRadius:99, fontSize:15, fontWeight:700, cursor:"pointer", transition:"all .2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=GOLD; e.currentTarget.style.color=GOLD; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor=BORDER; e.currentTarget.style.color=TEXT; }}>
            + NUEVA ACTIVIDAD
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:"flex", gap:56, marginTop:80, flexWrap:"wrap", justifyContent:"center" }}>
          {[["ACTIVIDADES",activities.length],["COMPLETADAS",`${doneT}/${allT.length}`],["PROGRESO",`${pct}%`]].map(([l,v])=>(
            <div key={l} style={{ textAlign:"center" }}>
              <p style={{ fontSize:"clamp(32px,5vw,56px)", fontWeight:900, color:l==="PROGRESO"&&pct===100?GOLD:TEXT, marginBottom:6 }}>{v}</p>
              <p style={{ fontSize:11, color:MUTED, fontWeight:600, letterSpacing:".15em" }}>{l}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}