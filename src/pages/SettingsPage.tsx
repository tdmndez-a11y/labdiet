import { useState } from 'react';
import { Section } from '@/components/shared/Section';
import { TextField } from '@/components/forms/TextField';
import type { Profile, ThemeSettings } from '@/types';
import { genId } from '@/utils/macros';

interface SettingsPageProps {
  theme: ThemeSettings;
  profiles: Profile[];
  onThemeChange: (theme: ThemeSettings) => void;
  onAddProfile: (profile: Profile) => void;
  onRemoveProfile: (id: string) => void;
}

export function SettingsPage({ theme, profiles, onThemeChange, onAddProfile, onRemoveProfile }: SettingsPageProps) {
  const [name, setName] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    onAddProfile({ id: genId(), name: name.trim() });
    setName('');
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Section title="Estilos (PDF) — Globais">
          <div className="grid gap-3 md:grid-cols-2">
            <TextField label="Título (fonte)" value={theme.titleFont} onChange={(value) => onThemeChange({ ...theme, titleFont: value })} />
            <TextField label="Subtítulo (fonte)" value={theme.subtitleFont} onChange={(value) => onThemeChange({ ...theme, subtitleFont: value })} />
            <TextField label="Cor primária" type="color" value={theme.primary} onChange={(value) => onThemeChange({ ...theme, primary: value })} />
            <TextField label="Papel (PDF)" type="color" value={theme.paperBg} onChange={(value) => onThemeChange({ ...theme, paperBg: value })} />
            <TextField label="Texto (PDF)" type="color" value={theme.paperText} onChange={(value) => onThemeChange({ ...theme, paperText: value })} />
            <TextField label="Fonte título da refeição" value={theme.mealTitleFont} onChange={(value) => onThemeChange({ ...theme, mealTitleFont: value })} />
            <TextField label="Fonte corpo da refeição" value={theme.mealBodyFont} onChange={(value) => onThemeChange({ ...theme, mealBodyFont: value })} />
            <TextField label="Fonte título das observações" value={theme.notesTitleFont} onChange={(value) => onThemeChange({ ...theme, notesTitleFont: value })} />
            <TextField label="Fonte corpo das observações" value={theme.notesBodyFont} onChange={(value) => onThemeChange({ ...theme, notesBodyFont: value })} />
          </div>
          <p className="mt-2 text-xs opacity-70">
            Fontes ativas: Título: {theme.titleFont} • Subtítulo: {theme.subtitleFont} • Corpo: {theme.bodyFont} • Refeição Título: {theme.mealTitleFont} • Refeição Corpo: {theme.mealBodyFont} • Obs Título: {theme.notesTitleFont} • Obs Corpo: {theme.notesBodyFont}
          </p>
        </Section>
      </div>

      <div className="lg:col-span-1">
        <Section title="Perfis (atalho)">
          <div className="grid gap-2">
            <TextField label="Nome do cliente" value={name} onChange={setName} />
            <button className="btn" onClick={handleCreate}>
              + Adicionar perfil
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {profiles.length === 0 ? (
              <p className="text-sm opacity-70">Sem perfis cadastrados.</p>
            ) : (
              profiles.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--input)] p-2">
                  <span className="font-medium">{profile.name}</span>
                  <button className="btn btn-danger" onClick={() => onRemoveProfile(profile.id)}>
                    Remover
                  </button>
                </div>
              ))
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}
