import { useMemo, useState } from 'react';
import { Section } from '@/components/shared/Section';
import { TextField } from '@/components/forms/TextField';
import type { Food } from '@/types';

interface FoodsPageProps {
  foods: Food[];
  favs: Set<string>;
  onToggleFav: (name: string) => void;
  onImportFoods: (file: File) => void;
  onAddFood: (food: Food) => void;
}

export function FoodsPage({ foods, favs, onToggleFav, onImportFoods, onAddFood }: FoodsPageProps) {
  const [query, setQuery] = useState('');
  const [macroFilter, setMacroFilter] = useState<'all' | 'protein' | 'carb' | 'fat' | 'fiber'>('all');
  const [newFood, setNewFood] = useState<Food>({ name: '', kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

  const filtered = useMemo(() => {
    let data = foods;
    if (query.trim()) {
      const term = query.trim().toLowerCase();
      data = data.filter((food) => food.name.toLowerCase().includes(term));
    }

    if (macroFilter !== 'all') {
      data = data.filter((food) => {
        switch (macroFilter) {
          case 'protein':
            return food.protein >= 10;
          case 'carb':
            return food.carbs >= 15 && food.fat < 5;
          case 'fat':
            return food.fat >= 10;
          case 'fiber':
            return (food.fiber ?? 0) >= 3;
          default:
            return true;
        }
      });
    }

    return [...data].sort((a, b) => Number(favs.has(b.name)) - Number(favs.has(a.name))).slice(0, 400);
  }, [foods, favs, macroFilter, query]);

  const handleSubmit = () => {
    if (!newFood.name.trim()) return;
    onAddFood({ ...newFood });
    setNewFood({ name: '', kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-1">
        <Section title="Importar lista" sticky>
          <label className="btn cursor-pointer">
            Importar CSV/JSON
            <input type="file" accept=".csv,.json" className="hidden" onChange={(event) => event.target.files?.[0] && onImportFoods(event.target.files[0])} />
          </label>
        </Section>

        <Section title="Novo alimento (manual)">
          <div className="grid grid-cols-2 gap-2">
            <TextField label="Nome" value={newFood.name} onChange={(value) => setNewFood((prev) => ({ ...prev, name: value }))} />
            <TextField label="kcal (100g)" value={newFood.kcal} onChange={(value) => setNewFood((prev) => ({ ...prev, kcal: Number(value) || 0 }))} />
            <TextField label="P (100g)" value={newFood.protein} onChange={(value) => setNewFood((prev) => ({ ...prev, protein: Number(value) || 0 }))} />
            <TextField label="C (100g)" value={newFood.carbs} onChange={(value) => setNewFood((prev) => ({ ...prev, carbs: Number(value) || 0 }))} />
            <TextField label="G (100g)" value={newFood.fat} onChange={(value) => setNewFood((prev) => ({ ...prev, fat: Number(value) || 0 }))} />
            <TextField label="F (100g)" value={newFood.fiber ?? 0} onChange={(value) => setNewFood((prev) => ({ ...prev, fiber: Number(value) || 0 }))} />
          </div>
          <div className="mt-3">
            <button className="btn" onClick={handleSubmit}>
              Adicionar alimento
            </button>
          </div>
        </Section>
      </div>

      <div className="lg:col-span-2">
        <Section title="Banco de Alimentos" right={<span className="text-xs opacity-70">Favoritos ficam no topo</span>}>
          <div className="mb-3 flex items-center gap-2">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-2 top-1.5 opacity-60">🔍</span>
              <input
                placeholder="Buscar alimento..."
                className="w-full rounded-xl pl-7 pr-2 py-2"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="flex gap-1">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'protein', label: '+P' },
                { id: 'carb', label: '+C baixo G' },
                { id: 'fat', label: '+G' },
                { id: 'fiber', label: '+Fibra' }
              ].map((option) => (
                <button
                  key={option.id}
                  className={`rounded-lg border px-2 py-1 text-sm ${macroFilter === option.id ? 'border-[var(--primary)] bg-[var(--input)]' : 'border-[var(--border)]'}`}
                  onClick={() => setMacroFilter(option.id as typeof macroFilter)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[70vh] space-y-1 overflow-auto pr-1">
            {filtered.map((food) => (
              <div key={food.name} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--input)] p-2">
                <div>
                  <p className="font-medium" title={`${food.kcal} kcal • P${food.protein} C${food.carbs} G${food.fat} /100g`}>
                    {food.name}
                  </p>
                  <p className="text-sm opacity-70">
                    {food.kcal} kcal • P{food.protein} C{food.carbs} G{food.fat} /100g
                  </p>
                </div>
                <button className="btn" onClick={() => onToggleFav(food.name)}>
                  {favs.has(food.name) ? '★' : '☆'}
                </button>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
