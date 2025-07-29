"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

interface ToasterContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export function Toaster() {
  const { toasts, removeToast } = useToaster();

  return (
    <div className="toast toast-end z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`alert alert-${
            toast.type === "error"
              ? "error"
              : toast.type === "warning"
              ? "warning"
              : toast.type === "info"
              ? "info"
              : "success"
          } animate-fade-in`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="btn btn-ghost btn-sm"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export function ToasterProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToasterContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToasterContext.Provider>
  );
}

export function useToaster() {
  const context = useContext(ToasterContext);
  if (context === undefined) {
    throw new Error("useToaster must be used within a ToasterProvider");
  }
  return context;
}
 