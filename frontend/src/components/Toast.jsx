import { useEffect } from "react";
import useStore from "../store/store";

function Toast() {
  const toasts = useStore(state => state.toasts);
  const removeToast = useStore(state => state.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [onRemove, toast.duration]);

  const colors = {
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
    error: "bg-red-500/10 border-red-500/20 text-red-500",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-500",
    warning: "bg-orange-500/10 border-orange-500/20 text-orange-500"
  };

  const colorClass = colors[toast.type] || colors.info;

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-md shadow-lg animate-fade-in w-80 ${colorClass}`}>
      <span className="text-sm font-medium">{toast.message}</span>
      <button onClick={onRemove} className="opacity-70 hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default Toast;
