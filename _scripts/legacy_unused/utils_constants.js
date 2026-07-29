// Categorías con iconos y colores
export const CATEGORIES = {
  Estudio:     { icon: "📚", color: "#7C6EF8", label: "Estudio" },
  Universidad: { icon: "🎓", color: "#FF6B81", label: "Universidad" },
  Salud:       { icon: "💪", color: "#2ED573", label: "Salud" },
  Trabajo:     { icon: "💼", color: "#D4A017", label: "Trabajo" },
  Personal:    { icon: "✨", color: "#1E90FF", label: "Personal" },
  Deporte:     { icon: "🏃", color: "#FF6348", label: "Deporte" },
  Familia:     { icon: "🏠", color: "#FF4757", label: "Familia" },
  Finanzas:    { icon: "💰", color: "#2ED573", label: "Finanzas" },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES);

export function getCategory(key) {
  return CATEGORIES[key] || { icon: "📌", color: "#D4A017", label: key };
}

// Prioridades
export const PRIORITIES = {
  High:   { label: "Alta", color: "#FF4757", bg: "rgba(255, 71, 87, 0.15)", border: "rgba(255, 71, 87, 0.3)", icon: "🔴" },
  Normal: { label: "Normal", color: "#D4A017", bg: "rgba(212, 160, 23, 0.15)", border: "rgba(212, 160, 23, 0.3)", icon: "🟡" },
  Low:    { label: "Baja", color: "#2ED573", bg: "rgba(46, 213, 115, 0.15)", border: "rgba(46, 213, 115, 0.3)", icon: "🟢" },
};

export const PRIORITY_KEYS = Object.keys(PRIORITIES);

export function getPriority(key) {
  return PRIORITIES[key] || PRIORITIES.Normal;
}

// Vistas de calendario
export const CALENDAR_VIEWS = [
  { key: "day", label: "Día", icon: "☀️", shortcut: "1" },
  { key: "week", label: "Semana", icon: "📅", shortcut: "2" },
  { key: "month", label: "Mes", icon: "🗓️", shortcut: "3" },
];

// Configuración de time-grid
export const TIME_GRID_CONFIG = {
  startHour: 6,
  endHour: 23,
  slotDuration: 30, // minutos
  slotHeight: 60, // px per hour
  allDayHeight: 80,
};

// Colores de tema (para uso directo si needed)
export const THEME = {
  gold: "#D4A017",
  goldLight: "#F0C040",
  goldDark: "#B8860B",
  bg: "#0A0A0A",
  surface: "#111111",
  surface2: "#1A1A1A",
  border: "#222222",
  text: "#F0F0F0",
  muted: "#666666",
};

// Atajos de teclado
export const KEYBOARD_SHORTCUTS = {
  NEW_ACTIVITY: "n",
  SEARCH: "/",
  TODAY: "t",
  PREV: "ArrowLeft",
  NEXT: "ArrowRight",
  PREV_WEEK: "Shift+ArrowLeft",
  NEXT_WEEK: "Shift+ArrowRight",
  VIEW_DAY: "1",
  VIEW_WEEK: "2",
  VIEW_MONTH: "3",
  CLOSE_MODAL: "Escape",
};

// Configuración de API
export const API_CONFIG = {
  baseURL: "https://localhost:57306/api",
  timeout: 10000,
};