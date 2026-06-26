export const GOLD = "#D4A017";
export const GOLD2 = "#F0C040";
export const BG = "#0A0A0A";
export const SURFACE = "#111111";
export const SURFACE2 = "#1A1A1A";
export const BORDER = "#222222";
export const TEXT = "#F0F0F0";
export const MUTED = "#666666";

export const PRIORITY = {
  High:   { color: "#FF4757", label: "Alta" },
  Normal: { color: GOLD,      label: "Normal" },
  Low:    { color: "#2ED573", label: "Baja" },
};

export const CATS = {
  Estudio:     { icon: "📚", color: "#7C6EF8" },
  Universidad: { icon: "🎓", color: "#FF6B81" },
  Salud:       { icon: "💪", color: "#2ED573" },
  Trabajo:     { icon: "💼", color: GOLD },
  Personal:    { icon: "✨", color: "#1E90FF" },
  Deporte:     { icon: "🏃", color: "#FF6348" },
  Familia:     { icon: "🏠", color: "#FF4757" },
  Finanzas:    { icon: "💰", color: "#2ED573" },
};

export const getCat = c => CATS[c] || { icon: "📌", color: GOLD };

export const DAY_NAMES = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
export const MONTH_NAMES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export const BASE = "https://localhost:57306/api";

export function sameDay(a, b) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const now = new Date(); now.setHours(0,0,0,0);
  const due = new Date(dateStr); due.setHours(0,0,0,0);
  return Math.round((due - now) / 86400000);
}

export function countdownLabel(days) {
  if (days < 0)   return { text: `Venció hace ${Math.abs(days)} día${Math.abs(days)>1?"s":""}`, color: "#FF4757" };
  if (days === 0) return { text: "Vence hoy", color: "#FF4757" };
  if (days === 1) return { text: "Vence mañana", color: GOLD };
  if (days <= 7)  return { text: `Tienes ${days} días para avanzar`, color: GOLD };
  return { text: `${days} días restantes`, color: "#2ED573" };
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "BUENOS DÍAS";
  if (h < 19) return "BUENAS TARDES";
  return "BUENAS NOCHES";
}

export function getWeekDays(refDate) {
  const d = new Date(refDate);
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(monday);
    x.setDate(monday.getDate() + i);
    return x;
  });
}