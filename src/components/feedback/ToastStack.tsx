import { ToastMessage } from '@/types';
import { Toast } from './Toast';

interface ToastStackProps {
  messages: ToastMessage[];
  onClose: (id: string) => void;
}

export function ToastStack({ messages, onClose }: ToastStackProps) {
  if (messages.length === 0) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3">
      {messages.map((message) => (
        <Toast key={message.id} message={message} onClose={onClose} />
      ))}
    </div>
  );
}
