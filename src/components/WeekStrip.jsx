import { addWeeks } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";
import { fmtDayLabel, fmtMonthYear, fmtWeekdayLabel, getWeekDays, isSameDay, isToday } from "../lib/date";

export default function WeekStrip({ date, setDate, weekOffset, setWeekOffset }) {
  const refDate = addWeeks(new Date(), weekOffset);
  const weekDays = getWeekDays(refDate);
  const label = fmtMonthYear(weekDays[0]);

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-xs font-semibold tracking-widest text-ink-faint uppercase">{label}</p>
        <div className="flex gap-2">
          <button
            aria-label="Semana anterior"
            onClick={() => setWeekOffset((p) => p - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-paper-light text-ink transition hover:border-thread hover:text-thread"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => { setWeekOffset(0); setDate(new Date()); }}
            className="rounded-lg border border-thread/30 bg-paper-light px-4 text-xs font-bold tracking-wide text-thread transition hover:bg-thread-soft"
          >
            HOY
          </button>
          <button
            aria-label="Semana siguiente"
            onClick={() => setWeekOffset((p) => p + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-paper-light text-ink transition hover:border-thread hover:text-thread"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {weekDays.map((d) => {
          const selected = isSameDay(d, date);
          const today = isToday(d);
          const past = d < new Date() && !today;
          return (
            <button
              key={d.toISOString()}
              onClick={() => setDate(new Date(d))}
              className={cn(
                "flex flex-col items-center rounded-xl border px-1 py-3 transition",
                selected
                  ? "border-thread bg-thread text-paper-light shadow-card"
                  : today
                    ? "border-thread/40 bg-paper-light text-ink hover:border-thread"
                    : "border-line bg-paper-light text-ink hover:border-ink-faint"
              )}
            >
              <span className={cn("text-[10px] font-bold tracking-wide uppercase", selected ? "text-paper-light/80" : "text-ink-faint")}>
                {fmtWeekdayLabel(d)}
              </span>
              <span className={cn("mt-1.5 font-display text-xl font-bold", !selected && past && "text-ink-faint")}>
                {fmtDayLabel(d)}
              </span>
              {today && !selected && <span className="mt-1.5 h-1 w-1 rounded-full bg-thread" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
