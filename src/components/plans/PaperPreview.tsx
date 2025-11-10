import type { Plan, ThemeSettings, Food } from '@/types';
import { macrosFor, round2 } from '@/utils/macros';

interface PaperPreviewProps {
  plan: Plan;
  foods: Food[];
  theme: ThemeSettings;
}

export function PaperPreview({ plan, foods, theme }: PaperPreviewProps) {
  return (
    <div className="paper rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 text-sm shadow-surface">
      <header className="mb-4 border-b border-white/10 pb-3">
        <h3 className="text-2xl font-bold" style={{ fontFamily: theme.titleFont }}>
          {plan.title || 'Plano Alimentar'}
        </h3>
        {plan.subtitle ? (
          <p className="opacity-80" style={{ fontFamily: theme.subtitleFont }}>
            {plan.subtitle}
          </p>
        ) : null}
        <p className="paper-meta mt-2">Cliente: {plan.client || '—'} • Objetivo: {plan.goal || '—'}</p>
      </header>

      <div className="space-y-4">
        {plan.meals.map((meal) => (
          <div key={meal.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h4 className="paper-meal-title text-lg font-semibold" style={{ fontFamily: theme.mealTitleFont }}>
              {meal.name}
            </h4>
            <table className="paper-table mt-2 w-full text-left text-xs" style={{ fontFamily: theme.mealBodyFont }}>
              <thead>
                <tr className="text-[11px] uppercase tracking-wide opacity-70">
                  <th className="py-1">Alimento</th>
                  <th className="py-1 text-right">Qtd (g)</th>
                  <th className="py-1 text-right">kcal</th>
                  <th className="py-1 text-right">P</th>
                  <th className="py-1 text-right">C</th>
                  <th className="py-1 text-right">G</th>
                </tr>
              </thead>
              <tbody>
                {meal.items.map((item) => {
                  const food = foods.find((candidate) => candidate.name === item.name);
                  const macros = food ? macrosFor(food, item.grams) : undefined;
                  return (
                    <tr key={item.id} className="border-t border-white/5">
                      <td className="py-1 font-medium">{item.name}</td>
                      <td className="py-1 text-right">{item.grams}</td>
                      <td className="py-1 text-right">{macros ? round2(macros.kcal) : '—'}</td>
                      <td className="py-1 text-right">{macros ? round2(macros.protein) : '—'}</td>
                      <td className="py-1 text-right">{macros ? round2(macros.carbs) : '—'}</td>
                      <td className="py-1 text-right">{macros ? round2(macros.fat) : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {meal.items.some((item) => item.notes) ? (
              <div className="mt-2 rounded-xl border border-white/5 bg-white/5 p-3 text-xs" style={{ fontFamily: theme.notesBodyFont }}>
                <strong>Notas rápidas:</strong>
                <ul className="mt-1 space-y-1 list-disc pl-4">
                  {meal.items
                    .filter((item) => item.notes)
                    .map((item) => (
                      <li key={`${item.id}-note`}>
                        <span className="font-medium">{item.name}:</span> {item.notes}
                      </li>
                    ))}
                </ul>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {plan.notes ? (
        <footer className="paper-notes-box mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs">
          <p className="text-sm font-semibold" style={{ fontFamily: theme.notesTitleFont }}>
            Observações gerais
          </p>
          <p className="mt-2 whitespace-pre-line" style={{ fontFamily: theme.notesBodyFont }}>
            {plan.notes}
          </p>
        </footer>
      ) : null}
    </div>
  );
}
