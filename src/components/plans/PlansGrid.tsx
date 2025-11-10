import type { Plan } from '@/types';
import { TEMPLATE_ICON } from '@/utils/constants';

interface PlansGridProps {
  plans: Plan[];
  allPlans: Plan[];
  currentId?: string | null;
  onSelect: (id: string) => void;
}

export function PlansGrid({ plans, allPlans, currentId, onSelect }: PlansGridProps) {
  if (plans.length === 0) {
    return <p className="text-sm opacity-70">Nenhum plano encontrado.</p>;
  }

  return (
    <div className="grid max-h-[48vh] gap-3 overflow-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
      {plans.map((plan) => {
        const assignedCount = plan.isTemplate
          ? allPlans.filter((candidate) => !candidate.isTemplate && candidate.sourceTemplateId === plan.id).length
          : 0;
        const isActive = plan.id === currentId;

        return (
          <button
            key={plan.id}
            onClick={() => onSelect(plan.id)}
            className={`relative rounded-xl border px-3 py-3 text-left transition ${
              isActive ? 'border-[var(--primary)] bg-[var(--input)]' : 'border-[var(--border)] hover:border-[var(--primary)]'
            }`}
          >
            <div className={`absolute left-0 top-0 h-full w-1.5 rounded-l-xl ${plan.isTemplate ? 'bg-[var(--primary)]' : 'bg-[#4a4d55]'}`} />
            <div className="flex items-center gap-2">
              <span className="font-medium" title={plan.title}>
                {plan.isTemplate ? `${TEMPLATE_ICON} ` : ''}
                {plan.title}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] opacity-80">
                {plan.client ? `Cliente: ${plan.client}` : plan.isTemplate ? 'Template' : '—'}
              </span>
              {plan.isTemplate ? (
                <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] opacity-80">
                  atribuído: {assignedCount}
                </span>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
