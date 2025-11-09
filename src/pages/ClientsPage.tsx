import { useMemo, useState } from 'react';
import { Section } from '@/components/shared/Section';
import { TextField } from '@/components/forms/TextField';
import { TEMPLATE_ICON } from '@/utils/constants';
import type { Plan, Profile } from '@/types';
import { genId } from '@/utils/macros';

interface ClientsPageProps {
  profiles: Profile[];
  plans: Plan[];
  onCreateProfile: (profile: Profile) => void;
  onDeleteProfile: (id: string) => void;
  onAssignTemplate: (templateId: string, profile: Profile) => void;
}

export function ClientsPage({ profiles, plans, onCreateProfile, onDeleteProfile, onAssignTemplate }: ClientsPageProps) {
  const [name, setName] = useState('');

  const templates = useMemo(() => plans.filter((plan) => plan.isTemplate), [plans]);

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreateProfile({ id: genId(), name: trimmed });
    setName('');
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Section title="Cadastrar Cliente" sticky right={<span className="text-xs opacity-60">Wireframe</span>}>
          <div className="grid gap-3">
            <TextField label="Nome do cliente" value={name} onChange={setName} />
            <button className="btn" onClick={handleCreate}>
              + Adicionar perfil
            </button>
          </div>
        </Section>
      </div>

      <div className="space-y-4 lg:col-span-2">
        <Section title="Clientes">
          <div className="space-y-3">
            {profiles.length === 0 ? (
              <p className="text-sm opacity-70">Sem perfis cadastrados.</p>
            ) : (
              profiles.map((profile) => {
                const assignedPlans = plans.filter((plan) => plan.clientId === profile.id);
                return (
                  <div key={profile.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="flex-1 text-lg font-semibold">{profile.name}</h3>
                      <button className="btn btn-danger" onClick={() => onDeleteProfile(profile.id)}>
                        Excluir
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold">Planos atribuídos</p>
                        {assignedPlans.length === 0 ? (
                          <p className="text-sm opacity-70">Nenhum plano atribuído.</p>
                        ) : (
                          <div className="mt-2 space-y-2">
                            {assignedPlans.map((plan) => (
                              <div key={plan.id} className="rounded-lg border border-[var(--border)] px-3 py-2">
                                <p className="font-medium">{plan.title}</p>
                                <p className="text-xs opacity-70">{plan.subtitle || '—'}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-semibold">Atribuir template</p>
                        {templates.length === 0 ? (
                          <p className="text-sm opacity-70">Nenhum template disponível.</p>
                        ) : (
                          <div className="mt-2 space-y-2 max-h-[32vh] overflow-auto pr-1">
                            {templates.map((template) => (
                              <div key={template.id} className="rounded-lg border border-[var(--border)] px-3 py-2">
                                <p className="font-medium">
                                  {TEMPLATE_ICON} {template.title}
                                </p>
                                <p className="text-xs opacity-70">{template.subtitle || '—'}</p>
                                <div className="mt-2 flex gap-2">
                                  <button className="btn" onClick={() => onAssignTemplate(template.id, profile)}>
                                    Atribuir
                                  </button>
                                  <button className="btn btn-outline" onClick={() => window.alert('Pré-visualização — wireframe')}>
                                    Pré-visualizar
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}
