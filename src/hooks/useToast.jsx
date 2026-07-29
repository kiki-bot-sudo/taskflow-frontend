import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, Info, TriangleAlert, XCircle } from "lucide-react";
import { cn } from "../lib/cn";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onHide={hideToast} />
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- exportar el hook junto al provider es intencional
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

function ToastContainer({ toasts, onHide }) {
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[9999] flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onHide={onHide} />
      ))}
    </div>
  );
}

const VARIANTS = {
  info: { icon: Info, className: "bg-cat-personal text-paper-light" },
  success: { icon: CheckCircle2, className: "bg-done text-paper-light" },
  error: { icon: XCircle, className: "bg-thread text-paper-light" },
  warning: { icon: TriangleAlert, className: "bg-priority-normal text-ink" },
};

function ToastItem({ toast, onHide }) {
  const { icon: Icon, className } = VARIANTS[toast.type] || VARIANTS.info;
  return (
    <div
      role="alert"
      aria-live="polite"
      onClick={() => onHide(toast.id)}
      className={cn(
        "animate-slide-up pointer-events-auto flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold shadow-pop",
        className
      )}
    >
      <Icon size={16} strokeWidth={2.5} />
      {toast.message}
    </div>
  );
}
