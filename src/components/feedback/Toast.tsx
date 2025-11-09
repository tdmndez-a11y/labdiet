import { ToastMessage } from '@/types';

interface ToastProps {
  message: ToastMessage;
  onClose: (id: string) => void;
}

export function Toast({ message, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-surface">
        <span>✅ {message.text}</span>
        <button className="btn btn-outline" onClick={() => onClose(message.id)}>
          Fechar
        </button>
      </div>
    </div>
  );
}
