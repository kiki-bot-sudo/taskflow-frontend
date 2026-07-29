import { createContext, useContext, useState, useCallback, ReactNode } from "react";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);

  const openModal = useCallback((modal) => {
    const id = Date.now() + Math.random();
    setModals(prev => [...prev, { ...modal, id }]);
    return id;
  }, []);

  const closeModal = useCallback((id) => {
    setModals(prev => prev.filter(m => m.id !== id));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal, closeAllModals }}>
      {children}
      <ModalContainer modals={modals} onClose={closeModal} />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
}

// Container
function ModalContainer({ modals, onClose }) {
  if (modals.length === 0) return null;

  // Solo renderiza el modal superior (último en el array)
  const modal = modals[modals.length - 1];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(modal.id); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={modal.title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-hidden bg-surface border border-border rounded-2xl shadow-card animate-pop-in flex flex-col"
      >
        {/* Header */}
        {modal.title && (
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 id="modal-title" className="text-xl font-bold text-text">{modal.title}</h2>
            <button
              onClick={() => onClose(modal.id)}
              className="p-1 rounded-lg text-muted hover:text-text hover:bg-surface-2 transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {modal.children}
        </div>

        {/* Footer */}
        {modal.footer && (
          <div className="flex items-center justify-end gap-3 p-5 border-t border-border bg-surface/50">
            {modal.footer}
          </div>
        )}
      </div>
    </div>
  );
}