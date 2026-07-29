import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths, isSameDay, isSameMonth, isToday, isBefore, isAfter, parseISO, startOfDay, endOfDay, getHours, getMinutes, setHours, setMinutes, eachDayOfInterval, eachHourOfInterval } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Formatea fecha para mostrar: "Lunes, 15 de Enero"
 */
export function formatDateLabel(date) {
  return format(date, "EEEE, d 'de' MMMM", { locale: es }).replace(/^./, c => c.toUpperCase());
}

/**
 * Formato corto: "Lun 15"
 */
export function formatDateShort(date) {
  return format(date, "EEE d", { locale: es }).replace(/^./, c => c.toUpperCase());
}

/**
 * Formato hora: "14:30"
 */
export function formatTime(date) {
  return format(date, "HH:mm");
}

/**
 * Formato fecha ISO para API: "2025-01-15"
 */
export function formatDateISO(date) {
  return format(date, "yyyy-MM-dd");
}

/**
 * Formato fecha-hora ISO para API: "2025-01-15T14:30:00.000Z"
 */
export function formatDateTimeISO(date) {
  return date.toISOString();
}

/**
 * Parse ISO string a Date
 */
export function parseDateISO(str) {
  return parseISO(str);
}

/**
 * Obtiene array de 7 días de la semana (Lun-Dom) para una fecha dada
 */
export function getWeekDays(date) {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Lunes
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/**
 * Obtiene array de días del mes (incluye días del mes anterior/siguiente para completar semanas)
 */
export function getMonthDays(date) {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

/**
 * Navegación de fechas
 */
export function goToToday() {
  return new Date();
}

export function goToDate(date, { day = 0, week = 0, month = 0 } = {}) {
  let d = new Date(date);
  if (day) d = addDays(d, day);
  if (week) d = addWeeks(d, week);
  if (month) d = addMonths(d, month);
  return d;
}

export function goPrevDay(date) { return subDays(date, 1); }
export function goNextDay(date) { return addDays(date, 1); }
export function goPrevWeek(date) { return subWeeks(date, 1); }
export function goNextWeek(date) { return addWeeks(date, 1); }
export function goPrevMonth(date) { return subMonths(date, 1); }
export function goNextMonth(date) { return addMonths(date, 1); }

/**
 * Checks
 */
export function isSameDayCheck(a, b) { return isSameDay(a, b); }
export function isTodayCheck(date) { return isToday(date); }
export function isBeforeNow(date) { return isBefore(date, new Date()); }
export function isAfterNow(date) { return isAfter(date, new Date()); }

/**
 * Genera slots de tiempo para Day/Week view (cada 30 min)
 */
export function generateTimeSlots(startHour = 0, endHour = 24, intervalMinutes = 30) {
  const slots = [];
  const baseDate = new Date();
  baseDate.setHours(startHour, 0, 0, 0);
  
  const endDate = new Date(baseDate);
  endDate.setHours(endHour, 0, 0, 0);
  
  const hours = eachHourOfInterval({ start: baseDate, end: endDate });
  
  hours.forEach(hour => {
    slots.push({ time: new Date(hour), label: formatTime(hour) });
    if (intervalMinutes === 30) {
      const halfHour = new Date(hour);
      halfHour.setMinutes(30);
      if (halfHour < endDate) {
        slots.push({ time: halfHour, label: formatTime(halfHour) });
      }
    }
  });
  
  return slots;
}

/**
 * Convierte hora ("14:30") a Date en una fecha base
 */
export function timeStringToDate(timeStr, baseDate = new Date()) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const d = new Date(baseDate);
  d.setHours(hours, minutes || 0, 0, 0);
  return d;
}

/**
 * Diferencia en minutos entre dos fechas
 */
export function diffInMinutes(a, b) {
  return Math.round((a - b) / 60000);
}

/**
 * Días hasta fecha (para countdown)
 */
export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const now = startOfDay(new Date());
  const due = startOfDay(parseISO(dateStr));
  return Math.round((due - now) / 86400000);
}

/**
 * Label de countdown human-readable
 */
export function countdownLabel(days) {
  if (days === null) return null;
  if (days < 0) return { text: `Venció hace ${Math.abs(days)} día${Math.abs(days) > 1 ? "s" : ""}`, color: "#FF4757", urgent: true };
  if (days === 0) return { text: "Vence hoy", color: "#FF4757", urgent: true };
  if (days === 1) return { text: "Vence mañana", color: "#D4A017", urgent: false };
  if (days <= 3) return { text: `Quedan ${days} días`, color: "#D4A017", urgent: false };
  if (days <= 7) return { text: `${days} días`, color: "#D4A017", urgent: false };
  return { text: `${days} días`, color: "#2ED573", urgent: false };
}

/**
 * Saludo según hora
 */
export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "BUENOS DÍAS";
  if (h < 19) return "BUENAS TARDES";
  return "BUENAS NOCHES";
}

/**
 * Horas de un día como array para grid
 */
export function getDayHours() {
  return Array.from({ length: 24 }, (_, h) => h);
}

/**
 * Altura en px para un slot de 30 min (base: 60px por hora)
 */
export const SLOT_HEIGHT = 60; // px per hour

export function minutesToPixels(minutes) {
  return (minutes / 60) * SLOT_HEIGHT;
}

export function pixelsToMinutes(pixels) {
  return Math.round((pixels / SLOT_HEIGHT) * 60);
}