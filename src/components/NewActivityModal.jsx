import { X } from "lucide-react";
import { CATS } from "../constants";

const inputClass =
  "w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-thread";

export default function NewActivityModal({ form, setForm, onClose, onSubmit }) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="animate-fade-up fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
    >
      <div className="animate-pop-in w-full max-w-md rounded-2xl border border-line bg-paper-light p-7 shadow-pop">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ink">Nueva actividad</h2>
          <button onClick={onClose} aria-label="Cerrar" className="text-ink-faint transition hover:text-thread">
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <input
            autoFocus
            placeholder="Título *"
            value={form.title}
            className={inputClass}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          />
          <input
            placeholder="Descripción"
            value={form.description}
            className={inputClass}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-2.5">
            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className={inputClass}
            >
              {Object.keys(CATS).map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
            <select
              value={form.priority}
              onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
              className={inputClass}
            >
              <option value="High">🔴 Alta</option>
              <option value="Normal">🟡 Normal</option>
              <option value="Low">🟢 Baja</option>
            </select>
          </div>

          <div className="mt-2 flex gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-line py-3 text-sm font-semibold text-ink-faint transition hover:border-ink-faint"
            >
              Cancelar
            </button>
            <button
              onClick={onSubmit}
              className="flex-[2] rounded-xl bg-thread py-3 text-sm font-bold text-paper-light transition hover:bg-thread-light"
            >
              Crear actividad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
