// ─── Toast — Premium toast notification (1:1 with uyimiz-vite-premium-2 CSS) ───
// Usage: const { toast } = useToast(); toast('Xarajat qo'shildi');
// Or imperatively: window.__toast?.('Message');
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

interface ToastContextValue {
  toast: (message: string) => void;
}

const ToastCtx = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<string[]>([]);

  const toast = useCallback((message: string) => {
    setMessages((prev) => [...prev, message]);
    setTimeout(() => {
      setMessages((prev) => prev.slice(1));
    }, 2600);
  }, []);

  // Expose for imperative use
  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>).__toast = toast;
  }

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {messages.map((msg, i) => (
          <div key={`${msg}-${i}`} className="toast">
            {msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
