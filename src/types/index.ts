export type MacroFields = 'kcal' | 'protein' | 'carbs' | 'fat' | 'fiber';

export interface Food {
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface MealItem {
  id: string;
  name: string;
  grams: number;
  notes?: string;
}

export interface Meal {
  id: string;
  name: string;
  items: MealItem[];
}

export interface Plan {
  id: string;
  title: string;
  subtitle: string;
  goal: string;
  client: string;
  clientId: string | null;
  profileId: string | null;
  isTemplate: boolean;
  sourceTemplateId?: string;
  meals: Meal[];
  notes: string;
}

export interface Profile {
  id: string;
  name: string;
}

export interface ThemeSettings {
  titleFont: string;
  subtitleFont: string;
  bodyFont: string;
  mealTitleFont: string;
  mealBodyFont: string;
  notesTitleFont: string;
  notesBodyFont: string;
  primary: string;
  text: string;
  bg: string;
  card: string;
  input: string;
  border: string;
  paperBg: string;
  paperText: string;
  logoDataUrl: string;
  paperBgDataUrl: string;
}

export interface UIState {
  sidebarOpen: boolean;
  route: 'clients' | 'plans' | 'database' | 'settings';
  showSettingsModal: boolean;
}

export interface FiltersState {
  q: string;
  clientId: string;
  onlyTemplates: boolean;
}

export interface ToastMessage {
  id: string;
  text: string;
}
