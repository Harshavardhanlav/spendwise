import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AlertCircleIcon, CheckCircle2Icon, InfoIcon, TriangleAlertIcon, XIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ToastTone = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toast: (input: Omit<Toast, 'id'>) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>');
  return context;
}

const icons: Record<ToastTone, React.ComponentType<{className?: string;}>> = {
  success: CheckCircle2Icon,
  error: AlertCircleIcon,
  warning: TriangleAlertIcon,
  info: InfoIcon
};

const iconTone: Record<ToastTone, string> = {
  success: 'text-income',
  error: 'text-expense',
  warning: 'text-warning',
  info: 'text-info'
};

export function ToastProvider({ children }: {children: React.ReactNode;}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (input: Omit<Toast, 'id'>) => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current.slice(-2), { ...input, id }]);
      window.setTimeout(() => dismiss(id), 4500);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>);

}

export function ToastViewport({ toasts, onDismiss }: {toasts: Toast[];onDismiss: (id: number) => void;}) {
  return (
    <div
      role="region"
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end">
      
      {toasts.map((item) =>
      <ToastCard key={item.id} toast={item} onDismiss={() => onDismiss(item.id)} />
      )}
    </div>);

}

export function ToastCard({ toast, onDismiss }: {toast: Omit<Toast, 'id'>;onDismiss?: () => void;}) {
  const Icon = icons[toast.tone];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto flex w-full animate-pop-in items-start gap-3 rounded-lg border border-line bg-surface p-3.5 shadow-pop sm:w-[360px]'
      )}>
      
      <Icon className={cn('mt-0.5 h-4.5 w-4.5 shrink-0', iconTone[toast.tone])} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-body font-medium text-ink-900">{toast.title}</p>
        {toast.description && <p className="mt-0.5 text-caption text-ink-600">{toast.description}</p>}
      </div>
      {onDismiss &&
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="-mr-1 -mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded text-ink-400 transition-colors duration-120 ease-out hover:bg-ink-100 hover:text-ink-900 focus-visible:focus-ring">
        
          <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      }
    </div>);

}