import { useMemo, useState } from 'react';
import { NumberInput } from '@/components/forms/NumberInput';
import { TextField } from '@/components/forms/TextField';
import type { Food, Meal } from '@/types';
import { findSubstitutions, genId, macrosFor, round2 } from '@/utils/macros';

interface MealEditorProps {
  meal: Meal;
  foods: Food[];
  onChange: (meal: Meal) => void;
  onRemove: () => void;
  favs: Set<string>;
  toggleFav: (name: string) => void;
}

export function MealEditor({ meal, foods, onChange, onRemove, favs, toggleFav }: MealEditorProps) {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const handleMealName = (name: string) => {
    onChange({ ...meal, name });
  };

  const handleItemChange = (id: string, updater: (item: Meal['items'][number]) => Meal['items'][number]) => {
    onChange({
      ...meal,
      items: meal.items.map((item) => (item.id === id ? updater(item) : item))
    });
  };

  const handleRemoveItem = (id: string) => {
    onChange({ ...meal, items: meal.items.filter((item) => item.id !== id) });
  };

  const addItem = () => {
    const firstFood = foods[0]?.name ?? '';
    onChange({
      ...meal,
      items: [
        ...meal.items,
        {
          id: genId(),
          name: firstFood,
          grams: 100,
          notes: ''
        }
      ]
    });
  };

  const macros = useMemo(() => {
    return meal.items.map((item) => {
      const food = foods.find((candidate) => candidate.name === item.name);
      if (!food) return null;
      return macrosFor(food, item.grams);
    });
  }, [foods, meal.items]);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--input)] p-3">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={meal.name}
          onChange={(event) => handleMealName(event.target.value)}
          className="w-full rounded-xl px-3 py-2 text-lg font-semibold"
        />
        <div className="flex gap-2">
          <button className="btn" onClick={addItem}>
            + Alimento
          </button>
          <button className="btn btn-outline" onClick={onRemove}>
            Remover refeição
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {meal.items.length === 0 ? (
          <p className="text-sm opacity-70">Nenhum alimento adicionado.</p>
        ) : (
          meal.items.map((item, index) => {
            const food = foods.find((candidate) => candidate.name === item.name);
            const itemMacros = macros[index];
            const isOpen = openItemId === item.id;

            return (
              <div key={item.id} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">
                    <select
                      className="min-w-[200px] rounded-lg px-3 py-2"
                      value={item.name}
                      onChange={(event) =>
                        handleItemChange(item.id, (prev) => ({ ...prev, name: event.target.value }))
                      }
                    >
                      {foods.map((candidate) => (
                        <option key={candidate.name} value={candidate.name}>
                          {candidate.name}
                        </option>
                      ))}
                    </select>
                    <NumberInput
                      value={item.grams}
                      onChange={(grams) => handleItemChange(item.id, (prev) => ({ ...prev, grams }))}
                      step={5}
                      className="bg-[var(--card)]"
                    />
                    <button className="btn" onClick={() => toggleFav(item.name)}>
                      {favs.has(item.name) ? '★' : '☆'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-outline" onClick={() => setOpenItemId(isOpen ? null : item.id)}>
                      {isOpen ? 'Ocultar sugestões' : 'Ver sugestões'}
                    </button>
                    <button className="btn btn-danger" onClick={() => handleRemoveItem(item.id)}>
                      Remover
                    </button>
                  </div>
                </div>

                {itemMacros ? (
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-5">
                    <MacroChip label="kcal" value={round2(itemMacros.kcal)} />
                    <MacroChip label="P" value={round2(itemMacros.protein)} />
                    <MacroChip label="C" value={round2(itemMacros.carbs)} />
                    <MacroChip label="G" value={round2(itemMacros.fat)} />
                    <MacroChip label="Fibra" value={round2(itemMacros.fiber)} />
                  </div>
                ) : null}

                {isOpen && food ? (
                  <SubstitutionsPanel food={food} grams={item.grams} foods={foods} />
                ) : null}

                <div className="mt-3">
                  <TextField
                    label="Observações"
                    value={item.notes ?? ''}
                    onChange={(text) =>
                      handleItemChange(item.id, (prev) => ({
                        ...prev,
                        notes: text
                      }))
                    }
                    placeholder="Instruções ou substituições"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function MacroChip({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded-lg border border-[var(--border)] bg-[var(--input)] px-2 py-1 text-center">
      {label}: <strong>{value}</strong>
    </span>
  );
}

interface SubstitutionsPanelProps {
  food: Food;
  grams: number;
  foods: Food[];
}

function SubstitutionsPanel({ food, grams, foods }: SubstitutionsPanelProps) {
  const suggestions = useMemo(() => findSubstitutions({ foods, targetFood: food, targetGrams: grams }), [food, foods, grams]);

  if (suggestions.length === 0) {
    return <p className="mt-3 text-sm opacity-70">Nenhuma substituição encontrada.</p>;
  }

  return (
    <div className="mt-3 space-y-2 rounded-xl border border-[var(--border)] bg-[var(--input)] p-3 text-sm">
      <p className="text-xs uppercase tracking-wide opacity-70">Sugestões de substituição</p>
      {suggestions.map((suggestion) => (
        <div key={suggestion.name} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2">
          <span className="font-medium">{suggestion.name}</span>
          <span className="text-xs opacity-70">{suggestion.grams} g</span>
          <span className="text-xs opacity-70">
            kcal {suggestion.macros.kcal} • P {suggestion.macros.protein} • C {suggestion.macros.carbs} • G {suggestion.macros.fat}
          </span>
        </div>
      ))}
    </div>
  );
}
