import { useCallback, useMemo, useState } from 'react';
import { ToastMessage } from '@/types';
import { genId } from '@/utils/macros';

export function useToast(initial: ToastMessage[] = []) {
  const [messages, setMessages] = useState<ToastMessage[]>(initial);

  const push = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: genId(), text }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  }, []);

  const clear = useCallback(() => setMessages([]), []);

  return useMemo(
    () => ({ messages, push, dismiss, clear }),
    [clear, dismiss, messages, push]
  );
}
