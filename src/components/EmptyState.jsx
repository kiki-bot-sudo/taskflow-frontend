import { NotebookPen, PartyPopper } from "lucide-react";

export default function EmptyState({ filter }) {
  const isDone = filter === "done";
  const Icon = isDone ? PartyPopper : NotebookPen;

  return (
    <div className="col-span-full flex flex-col items-center py-24 text-center">
      <Icon size={40} strokeWidth={1.5} className="mb-4 text-ink-faint" />
      <p className="font-display text-lg font-semibold text-ink">
        {isDone ? "Nada completado todavía" : "Sin actividades este día"}
      </p>
      <p className="mt-1.5 text-sm text-ink-faint">
        {isDone ? "Marca tareas como hechas para verlas aquí." : "Agrega tu primera actividad para empezar el hilo del día."}
      </p>
    </div>
  );
}
