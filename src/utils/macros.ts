import { Food, Meal, MacroFields, Plan } from '@/types';

export const MACRO_KEYS: MacroFields[] = ['kcal', 'protein', 'carbs', 'fat', 'fiber'];

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function macrosFor(food: Food, grams: number) {
  const fraction = grams / 100;
  return {
    kcal: food.kcal * fraction,
    protein: food.protein * fraction,
    carbs: food.carbs * fraction,
    fat: food.fat * fraction,
    fiber: (food.fiber ?? 0) * fraction
  } as Record<MacroFields, number>;
}

export function macroDistance(a: Record<MacroFields, number>, b: Record<MacroFields, number>): number {
  const weights = { kcal: 1.2, protein: 1.5, carbs: 1, fat: 1, fiber: 0.6 } satisfies Record<MacroFields, number>;
  return Math.sqrt(
    (weights.kcal * (a.kcal - b.kcal)) ** 2 +
      (weights.protein * (a.protein - b.protein)) ** 2 +
      (weights.carbs * (a.carbs - b.carbs)) ** 2 +
      (weights.fat * (a.fat - b.fat)) ** 2 +
      (weights.fiber * (a.fiber - b.fiber)) ** 2
  );
}

export function estimateGramsToMatch(target: Record<MacroFields, number>, candidate: Food) {
  const macros = [candidate.protein / 100, candidate.carbs / 100, candidate.fat / 100];
  const targetVec = [target.protein, target.carbs, target.fat];
  const dotMM = macros[0] ** 2 + macros[1] ** 2 + macros[2] ** 2;
  if (dotMM === 0) return 0;
  const dotMT = macros[0] * targetVec[0] + macros[1] * targetVec[1] + macros[2] * targetVec[2];
  const grams = (dotMT / dotMM) * 100;
  return Math.max(0, grams);
}

export interface SubstitutionOptions {
  foods: Food[];
  targetFood: Food;
  targetGrams: number;
  kcalTolPct?: number;
  pTolPct?: number;
  cTolPct?: number;
  fTolPct?: number;
  maxItems?: number;
}

export interface SubstitutionResult {
  name: string;
  grams: number;
  macros: Record<MacroFields, number>;
  distance: number;
}

export function findSubstitutions({
  foods,
  targetFood,
  targetGrams,
  kcalTolPct = 0.12,
  pTolPct = 0.15,
  cTolPct = 0.2,
  fTolPct = 0.2,
  maxItems = 10
}: SubstitutionOptions): SubstitutionResult[] {
  const target = macrosFor(targetFood, targetGrams);
  const results: SubstitutionResult[] = [];

  foods.forEach((candidate) => {
    if (candidate.name === targetFood.name) return;
    const grams = estimateGramsToMatch(target, candidate);
    if (!Number.isFinite(grams) || grams <= 0 || grams > 1000) return;
    const macros = macrosFor(candidate, grams);
    const ok =
      Math.abs(macros.kcal - target.kcal) <= kcalTolPct * Math.max(1, target.kcal) &&
      Math.abs(macros.protein - target.protein) <= pTolPct * Math.max(1, target.protein) &&
      Math.abs(macros.carbs - target.carbs) <= cTolPct * Math.max(1, target.carbs) &&
      Math.abs(macros.fat - target.fat) <= fTolPct * Math.max(1, target.fat);

    if (!ok) return;

    results.push({
      name: candidate.name,
      grams: round2(grams),
      macros: Object.fromEntries(
        (Object.entries(macros) as [MacroFields, number][]).map(([key, value]) => [key, round2(value)])
      ) as Record<MacroFields, number>,
      distance: macroDistance(target, macros)
    });
  });

  return results.sort((a, b) => a.distance - b.distance).slice(0, maxItems);
}

export function planTotals(plan: Plan, foods: Food[]) {
  const totals: Record<MacroFields, number> = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  plan.meals.forEach((meal) => {
    meal.items.forEach((item) => {
      const food = foods.find((candidate) => candidate.name === item.name);
      if (!food) return;
      const macros = macrosFor(food, item.grams);
      MACRO_KEYS.forEach((macro) => {
        totals[macro] += macros[macro] ?? 0;
      });
    });
  });
  MACRO_KEYS.forEach((macro) => {
    totals[macro] = round2(totals[macro]);
  });
  return totals;
}

export function clonePlan(plan: Plan): Plan {
  return structuredClone(plan);
}

export function ensureMealIds(plan: Plan): Plan {
  return {
    ...plan,
    meals: plan.meals.map((meal) => ({
      ...meal,
      items: meal.items.map((item) => ({ ...item }))
    }))
  };
}
