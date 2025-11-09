import { Food, ThemeSettings } from '@/types';

export const LS_KEYS = {
  foods: 'akt_diet_builder_foods_v1',
  legacyPlan: 'akt_diet_builder_plan_v1',
  theme: 'akt_diet_builder_theme_v1',
  profiles: 'akt_diet_builder_profiles_v1',
  ui: 'akt_diet_builder_ui_v1',
  plans: 'akt_plans_v1',
  favs: 'akt_food_favorites_v1'
} as const;

export const DEFAULT_THEME: ThemeSettings = {
  titleFont: 'Neue Haas Grotesk',
  subtitleFont: 'Inter',
  bodyFont: 'Inter',
  mealTitleFont: 'Inter',
  mealBodyFont: 'Inter',
  notesTitleFont: 'Inter',
  notesBodyFont: 'Inter',
  primary: '#ff6b00',
  text: '#eaeaec',
  bg: '#0a0a0b',
  card: '#131315',
  input: '#191a1d',
  border: '#282a2f',
  paperBg: '#121214',
  paperText: '#f1f1f3',
  logoDataUrl: '',
  paperBgDataUrl: ''
};

export const SAMPLE_FOODS: Food[] = [
  { name: 'Frango grelhado (peito)', kcal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
  { name: 'Arroz branco cozido', kcal: 130, protein: 2.4, carbs: 28, fat: 0.3, fiber: 0.4 },
  { name: 'Feijão carioca cozido', kcal: 76, protein: 4.8, carbs: 13.6, fat: 0.5, fiber: 8.5 }
];

export const TACO_FOODS: Food[] = [
  { name: 'Arroz, integral, cozido', kcal: 122.6, protein: 2.6, carbs: 25.8, fat: 1.0, fiber: 2.7 },
  { name: 'Arroz, integral, cru', kcal: 356.3, protein: 7.3, carbs: 77.5, fat: 1.9, fiber: 4.8 },
  { name: 'Arroz, tipo 1, cozido', kcal: 124.2, protein: 2.5, carbs: 28.1, fat: 0.2, fiber: 1.6 }
];

export const TEMPLATE_ICON = '🗂️';
