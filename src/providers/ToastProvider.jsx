"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext(null);

const icons = { success: CheckCircle2, error: AlertCircle, info: Info };
const colors = {
  success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
  error: "border-red-500/20 bg-red-500/5 text-red-400",
  info: "border-accent/20 bg-accent/5 text-accent",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const toast = useCallback((msg) => addToast(msg, "info"), [addToast]);
  toast.success = (msg) => addToast(msg, "success");
  toast.error = (msg) => addToast(msg, "error");
  toast.info = (msg) => addToast(msg, "info");

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-100 space-y-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type] || Info;
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2 }} className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg border shadow-lg shadow-black/20 ${colors[t.type]}`}>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-[13px] flex-1">{t.message}</span>
                <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} className="text-zinc-500 hover:text-zinc-300 cursor-pointer shrink-0"><X className="w-3 h-3" /></button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
