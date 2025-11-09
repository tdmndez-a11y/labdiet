import { Fragment, ChangeEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import type { ThemeSettings } from '@/types';
import { TextField } from '@/components/forms/TextField';

interface SettingsModalProps {
  open: boolean;
  theme: ThemeSettings;
  onChange: (theme: ThemeSettings) => void;
  onClose: () => void;
}

export function SettingsModal({ open, theme, onChange, onClose }: SettingsModalProps) {
  const handleFile = async (event: ChangeEvent<HTMLInputElement>, field: 'logoDataUrl' | 'paperBgDataUrl') => {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    onChange({ ...theme, [field]: dataUrl });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-surface">
                <Dialog.Title className="text-xl font-semibold">Configurações de tema</Dialog.Title>
                <p className="mt-1 text-sm opacity-70">
                  Personalize fontes, cores e assets do PDF exportado. As alterações são salvas automaticamente.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Fonte — título"
                    value={theme.titleFont}
                    onChange={(value) => onChange({ ...theme, titleFont: value })}
                  />
                  <TextField
                    label="Fonte — subtítulo"
                    value={theme.subtitleFont}
                    onChange={(value) => onChange({ ...theme, subtitleFont: value })}
                  />
                  <TextField
                    label="Cor primária"
                    type="color"
                    value={theme.primary}
                    onChange={(value) => onChange({ ...theme, primary: value })}
                  />
                  <TextField
                    label="Cor do papel"
                    type="color"
                    value={theme.paperBg}
                    onChange={(value) => onChange({ ...theme, paperBg: value })}
                  />
                  <TextField
                    label="Cor do texto (PDF)"
                    type="color"
                    value={theme.paperText}
                    onChange={(value) => onChange({ ...theme, paperText: value })}
                  />
                  <TextField
                    label="Fonte — título refeição"
                    value={theme.mealTitleFont}
                    onChange={(value) => onChange({ ...theme, mealTitleFont: value })}
                  />
                  <TextField
                    label="Fonte — corpo refeição"
                    value={theme.mealBodyFont}
                    onChange={(value) => onChange({ ...theme, mealBodyFont: value })}
                  />
                  <TextField
                    label="Fonte — título observações"
                    value={theme.notesTitleFont}
                    onChange={(value) => onChange({ ...theme, notesTitleFont: value })}
                  />
                  <TextField
                    label="Fonte — corpo observações"
                    value={theme.notesBodyFont}
                    onChange={(value) => onChange({ ...theme, notesBodyFont: value })}
                  />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="opacity-80">Logo (PNG)</span>
                    <input type="file" accept="image/*" onChange={(event) => handleFile(event, 'logoDataUrl')} />
                  </label>
                  <label className="flex flex-col gap-2 text-sm">
                    <span className="opacity-80">Textura de papel</span>
                    <input type="file" accept="image/*" onChange={(event) => handleFile(event, 'paperBgDataUrl')} />
                  </label>
                </div>

                <div className="mt-8 flex justify-end">
                  <button className="btn btn-outline" onClick={onClose}>
                    Fechar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
