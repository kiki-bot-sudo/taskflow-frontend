import { createContext, useContext, useState, useCallback } from "react";
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
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
    <div style={{
      position: "fixed",
      bottom: 24,
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      zIndex: 9999,
      pointerEvents: "none"
    }}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onHide={onHide} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onHide }) {
  const styles = {
    info: { background: "#1E90FF", color: "#fff" },
    success: { background: "#2ED573", color: "#0A0A0A" },
    error: { background: "#FF4757", color: "#fff" },
    warning: { background: "#F0C040", color: "#0A0A0A" },
  };

  const style = styles[toast.type] || styles.info;

  return (
    <div
      style={{
        pointerEvents: "auto",
        padding: "12px 28px",
        borderRadius: 9999,
        fontSize: 14,
        fontWeight: 700,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        animation: "slideUp .3s ease",
        background: style.background,
        color: style.color,
        whiteSpace: "nowrap",
        cursor: "pointer",
      }}
      onClick={() => onHide(toast.id)}
      role="alert"
      aria-live="polite"
    >
      {toast.message}
    </div>
  );
}