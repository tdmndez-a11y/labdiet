import { useMemo } from 'react';
import { Section } from '@/components/shared/Section';
import { TextField } from '@/components/forms/TextField';
import { FiltersBar } from '@/components/plans/FiltersBar';
import { PlansGrid } from '@/components/plans/PlansGrid';
import { TotalsCard } from '@/components/plans/TotalsCard';
import { MealEditor } from '@/components/plans/MealEditor';
import { PaperPreview } from '@/components/plans/PaperPreview';
import type { FiltersState, Food, Plan, Profile, ThemeSettings } from '@/types';
import { download } from '@/utils/files';

interface PlansPageProps {
  plan: Plan | null;
  foods: Food[];
  totals: Record<string, number>;
  filters: FiltersState;
  theme: ThemeSettings;
  plans: Plan[];
  profiles: Profile[];
  favs: Set<string>;
  onChangeFilters: (filters: FiltersState) => void;
  onSelectPlan: (id: string) => void;
  onPlanField: (field: keyof Plan, value: Plan[keyof Plan]) => void;
  onConvertToTemplate: () => void;
  onUpdateMeal: (mealId: string, updater: (meal: Plan['meals'][number]) => Plan['meals'][number]) => void;
  onRemoveMeal: (mealId: string) => void;
  onAddMeal: () => void;
  toggleFav: (name: string) => void;
}

export function PlansPage({
  plan,
  foods,
  totals,
  filters,
  theme,
  plans,
  profiles,
  favs,
  onChangeFilters,
  onSelectPlan,
  onPlanField,
  onConvertToTemplate,
  onUpdateMeal,
  onRemoveMeal,
  onAddMeal,
  toggleFav
}: PlansPageProps) {
  const meals = plan?.meals ?? [];

  if (!plan) {
    return (
      <div className="opacity-80">
        <Section title="Selecionar plano" sticky>
          <FiltersBar filters={filters} profiles={profiles} onChange={onChangeFilters} />
          <PlansGrid plans={plans} allPlans={plans} onSelect={onSelectPlan} />
        </Section>
      </div>
    );
  }

  const mealsWithHandlers = useMemo(
    () =>
      meals.map((meal) => ({
        meal,
        onChange: (next: Plan['meals'][number]) => onUpdateMeal(meal.id, () => next),
        onRemove: () => onRemoveMeal(meal.id)
      })),
    [meals, onRemoveMeal, onUpdateMeal]
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-1">
        <Section
          title="Totais do Plano"
          sticky
          right={
            <button className="btn btn-outline" onClick={onConvertToTemplate}>
              Converter → Template
            </button>
          }
        >
          <TotalsCard totals={totals} />
          <p className="mt-2 text-xs opacity-70">
            Cliente: {plan.client || '—'} • Objetivo: {plan.goal || '—'} • Refeições: {plan.meals.length}
          </p>
        </Section>

        <Section title="Planos (filtrados)">
          <FiltersBar filters={filters} profiles={profiles} onChange={onChangeFilters} compact />
          <PlansGrid plans={plans} allPlans={plans} currentId={plan.id} onSelect={onSelectPlan} />
        </Section>
      </div>

      <div className="space-y-6 lg:col-span-2 lg:col-start-2">
        <Section
          title="Cabeçalho do Plano"
          right={
            <button className="btn btn-outline" onClick={() => window.print()}>
              Imprimir
            </button>
          }
        >
          <div className="grid gap-3 md:grid-cols-2">
            <TextField label="Título" value={plan.title} onChange={(value) => onPlanField('title', value)} />
            <TextField
              label="Subtítulo"
              value={plan.subtitle}
              onChange={(value) => onPlanField('subtitle', value)}
            />
            <TextField label="Cliente" value={plan.client} onChange={(value) => onPlanField('client', value)} />
            <TextField label="Objetivo" value={plan.goal} onChange={(value) => onPlanField('goal', value)} />
          </div>
        </Section>

        <Section
          title="Refeições"
          right={
            <button className="btn" onClick={onAddMeal}>
              + Refeição
            </button>
          }
        >
          <div className="space-y-4">
            {mealsWithHandlers.length === 0 ? (
              <p className="text-sm opacity-70">Adicione sua primeira refeição para montar o plano.</p>
            ) : (
              mealsWithHandlers.map(({ meal: currentMeal, onChange, onRemove }) => (
                <MealEditor
                  key={currentMeal.id}
                  meal={currentMeal}
                  foods={foods}
                  onChange={onChange}
                  onRemove={onRemove}
                  favs={favs}
                  toggleFav={toggleFav}
                />
              ))
            )}
          </div>
        </Section>

        <Section title="Observações">
          <textarea
            className="min-h-[120px] w-full rounded-xl px-3 py-2"
            value={plan.notes}
            onChange={(event) => onPlanField('notes', event.target.value)}
          />
          <div className="mt-3 flex justify-end">
            <button
              className="btn btn-outline"
              onClick={() => download(`${plan.title || 'plano'}.json`, JSON.stringify(plan, null, 2))}
            >
              Exportar JSON
            </button>
          </div>
        </Section>

        <Section title="Prévia de Impressão (PDF)">
          <PaperPreview plan={plan} foods={foods} theme={theme} />
        </Section>
      </div>
    </div>
  );
}
