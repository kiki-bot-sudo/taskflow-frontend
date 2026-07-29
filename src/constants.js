export const BASE = "https://localhost:57306/api";

export const PRIORITY = {
  High: { label: "Alta", color: "var(--color-priority-high)", dot: "🔴" },
  Normal: { label: "Normal", color: "var(--color-priority-normal)", dot: "🟡" },
  Low: { label: "Baja", color: "var(--color-priority-low)", dot: "🟢" },
};

export const CATS = {
  Estudio: { icon: "📚", color: "var(--color-cat-estudio)" },
  Universidad: { icon: "🎓", color: "var(--color-cat-universidad)" },
  Salud: { icon: "💪", color: "var(--color-cat-salud)" },
  Trabajo: { icon: "💼", color: "var(--color-cat-trabajo)" },
  Personal: { icon: "✨", color: "var(--color-cat-personal)" },
  Deporte: { icon: "🏃", color: "var(--color-cat-deporte)" },
  Familia: { icon: "🏠", color: "var(--color-cat-familia)" },
  Finanzas: { icon: "💰", color: "var(--color-cat-finanzas)" },
};

export const getCat = (c) => CATS[c] || { icon: "📌", color: "var(--color-thread)" };

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}
