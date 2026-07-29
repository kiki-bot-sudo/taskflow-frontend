import {
  isSameDay,
  isToday,
  startOfWeek,
  addDays,
  differenceInCalendarDays,
  format,
} from "date-fns";
import { es } from "date-fns/locale";

export { isSameDay, isToday };

/** Los 7 días (lunes a domingo) de la semana que contiene refDate. */
export function getWeekDays(refDate) {
  const monday = startOfWeek(refDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  return differenceInCalendarDays(new Date(dateStr), new Date());
}

export function countdownLabel(days) {
  if (days < 0) return { text: `Venció hace ${Math.abs(days)} día${Math.abs(days) > 1 ? "s" : ""}`, tone: "high" };
  if (days === 0) return { text: "Vence hoy", tone: "high" };
  if (days === 1) return { text: "Vence mañana", tone: "normal" };
  if (days <= 7) return { text: `Faltan ${days} días`, tone: "normal" };
  return { text: `${days} días restantes`, tone: "low" };
}

export const fmtDayLabel = (d) => format(d, "d");
export const fmtWeekdayLabel = (d) => format(d, "EEE", { locale: es }).replace(".", "");
export const fmtMonthYear = (d) => format(d, "MMMM yyyy", { locale: es });
export const fmtFullDate = (d) => format(d, "EEEE d 'de' MMMM", { locale: es });
export const fmtIso = (d) => format(d, "yyyy-MM-dd");
