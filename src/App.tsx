import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SidebarTrigger } from '@/components/layout/SidebarTrigger';
import { ToastStack } from '@/components/feedback/ToastStack';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { ClientsPage } from '@/pages/ClientsPage';
import { PlansPage } from '@/pages/PlansPage';
import { FoodsPage } from '@/pages/FoodsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/useToast';
import type { FiltersState, Food, Plan, Profile, ThemeSettings, UIState } from '@/types';
import { DEFAULT_THEME, LS_KEYS, TACO_FOODS, TEMPLATE_ICON } from '@/utils/constants';
import { clonePlan, genId, planTotals } from '@/utils/macros';
import { globalStyles } from '@/utils/theme';

function ensurePlanStructure(plan: Plan): Plan {
  return {
    ...plan,
    meals: plan.meals.map((meal) => ({
      ...meal,
      items: meal.items.map((item) => ({ id: item.id ?? genId(), ...item }))
    }))
  };
}

const DEFAULT_UI: UIState = { sidebarOpen: true, route: 'plans', showSettingsModal: false };

const DEFAULT_PLAN: Plan = {
  id: genId(),
  title: 'Plano Alimentar',
  subtitle: '',
  goal: '',
  client: '',
  clientId: null,
  profileId: null,
  isTemplate: false,
  meals: [
    { id: genId(), name: 'Café da manhã', items: [] },
    { id: genId(), name: 'Almoço', items: [] }
  ],
  notes: ''
};

export default function App() {
  const [theme, setTheme] = useLocalStorage<ThemeSettings>(LS_KEYS.theme, DEFAULT_THEME);
  const [foods, setFoods] = useLocalStorage<Food[]>(LS_KEYS.foods, TACO_FOODS);
  const [profiles, setProfiles] = useLocalStorage<Profile[]>(LS_KEYS.profiles, []);
  const [planList, setPlanList] = useLocalStorage<Plan[]>(LS_KEYS.plans, [DEFAULT_PLAN]);
  const [ui, setUi] = useLocalStorage<UIState>(LS_KEYS.ui, DEFAULT_UI);
  const [favArray, setFavArray] = useLocalStorage<string[]>(LS_KEYS.favs, []);

  const favs = useMemo(() => new Set(favArray), [favArray]);

  const [currentPlanId, setCurrentPlanId] = useState<string | null>(planList[0]?.id ?? null);
  const [filters, setFilters] = useState<FiltersState>({ q: '', clientId: '', onlyTemplates: false });
  const { messages, push, dismiss } = useToast();

  useEffect(() => {
    if (!currentPlanId && planList.length > 0) {
      setCurrentPlanId(planList[0].id);
    }
  }, [currentPlanId, planList]);

  const plans = useMemo(() => planList.map(ensurePlanStructure), [planList]);

  const filteredPlans = useMemo(() => {
    const term = filters.q.trim().toLowerCase();
    return plans.filter((plan) => {
      if (filters.onlyTemplates && !plan.isTemplate) return false;
      if (filters.clientId && plan.clientId !== filters.clientId) return false;
      if (term && !plan.title.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [filters, plans]);

  const currentPlan = useMemo(() => plans.find((plan) => plan.id === currentPlanId) ?? null, [plans, currentPlanId]);

  const totals = useMemo(() => (currentPlan ? planTotals(currentPlan, foods) : { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }), [currentPlan, foods]);

  const setPlans = (updater: (plans: Plan[]) => Plan[]) => {
    setPlanList((prev) => updater(prev).map(ensurePlanStructure));
  };

  const updatePlan = (id: string, updater: (plan: Plan) => Plan) => {
    setPlans((prev) => prev.map((plan) => (plan.id === id ? updater(plan) : plan)));
  };

  const setPlanField = (field: keyof Plan, value: Plan[keyof Plan]) => {
    if (!currentPlan) return;
    updatePlan(currentPlan.id, (plan) => ({ ...plan, [field]: value }));
  };

  const addMeal = () => {
    if (!currentPlan) return;
    updatePlan(currentPlan.id, (plan) => ({
      ...plan,
      meals: [...plan.meals, { id: genId(), name: `Refeição ${plan.meals.length + 1}`, items: [] }]
    }));
  };

  const updateMeal = (mealId: string, updater: (meal: Plan['meals'][number]) => Plan['meals'][number]) => {
    if (!currentPlan) return;
    updatePlan(currentPlan.id, (plan) => ({
      ...plan,
      meals: plan.meals.map((meal) => (meal.id === mealId ? updater(meal) : meal))
    }));
  };

  const removeMeal = (mealId: string) => {
    if (!currentPlan) return;
    updatePlan(currentPlan.id, (plan) => ({
      ...plan,
      meals: plan.meals.filter((meal) => meal.id !== mealId)
    }));
  };

  const createPlan = (isTemplate = false) => {
    const title = window.prompt(isTemplate ? 'Título do template:' : 'Título do plano:');
    if (!title) return;
    const newPlan: Plan = {
      ...DEFAULT_PLAN,
      id: genId(),
      title,
      isTemplate,
      meals: []
    };
    setPlans((prev) => [newPlan, ...prev]);
    if (!isTemplate) {
      setCurrentPlanId(newPlan.id);
    }
    push(isTemplate ? 'Template criado' : 'Plano criado');
  };

  const duplicatePlan = () => {
    if (!currentPlan) return;
    const copy = clonePlan(currentPlan);
    copy.id = genId();
    copy.title = `${currentPlan.title} (cópia)`;
    copy.isTemplate = currentPlan.isTemplate;
    setPlans((prev) => [copy, ...prev]);
    setCurrentPlanId(copy.id);
    push('Plano duplicado');
  };

  const deleteCurrentPlan = () => {
    if (!currentPlan) return;
    if (!window.confirm('Excluir este plano/template?')) return;
    setPlans((prev) => prev.filter((plan) => plan.id !== currentPlan.id));
    setCurrentPlanId((prev) => (prev === currentPlan.id ? plans.find((plan) => plan.id !== currentPlan.id)?.id ?? null : prev));
    push('Plano excluído');
  };

  const convertToTemplate = () => {
    if (!currentPlan) return;
    updatePlan(currentPlan.id, (plan) => ({ ...plan, isTemplate: true, client: '', clientId: null, profileId: null }));
    push('Plano convertido em template');
  };

  const assignToProfile = (plan: Plan, profileId: string | null) => {
    if (!profileId) {
      updatePlan(plan.id, (current) => ({ ...current, clientId: null, client: '', profileId: null }));
      push('Plano desatribuído');
      return;
    }
    const profile = profiles.find((candidate) => candidate.id === profileId);
    if (!profile) return;
    if (plan.isTemplate) {
      const clone = clonePlan(plan);
      clone.id = genId();
      clone.isTemplate = false;
      clone.clientId = profileId;
      clone.client = profile.name;
      clone.title = `${plan.title} — ${profile.name}`;
      clone.sourceTemplateId = plan.id;
      setPlans((prev) => [clone, ...prev]);
      setCurrentPlanId(clone.id);
      push('Template atribuído');
      return;
    }
    updatePlan(plan.id, (current) => ({ ...current, clientId: profileId, client: profile.name, profileId }));
    push('Plano atribuído');
  };

  const toggleFav = (name: string) => {
    setFavArray((prev) => {
      if (prev.includes(name)) {
        return prev.filter((item) => item !== name);
      }
      return [...prev, name];
    });
  };

  const handleImportFoods = (file: File) => {
    const reader = new FileReader();
    const isCSV = file.name.toLowerCase().endsWith('.csv');
    reader.onload = () => {
      try {
        if (isCSV) {
          const text = String(reader.result);
          const rows = text.split(/\r?\n/).map((row) => row.trim()).filter(Boolean);
          const header = rows.shift();
          if (!header) throw new Error('CSV sem cabeçalho');
          const columns = header.split(',').map((column) => column.trim().toLowerCase());
          const required = ['name', 'kcal', 'protein', 'carbs', 'fat', 'fiber'];
          const missing = required.filter((column) => !columns.includes(column));
          if (missing.length > 0) throw new Error(`CSV sem colunas: ${missing.join(', ')}`);
          const idx = (key: string) => columns.indexOf(key);
          const parsed: Food[] = rows.map((row) => {
            const cells = row.split(',').map((cell) => cell.trim());
            return {
              name: cells[idx('name')] ?? '',
              kcal: Number(cells[idx('kcal')] ?? 0),
              protein: Number(cells[idx('protein')] ?? 0),
              carbs: Number(cells[idx('carbs')] ?? 0),
              fat: Number(cells[idx('fat')] ?? 0),
              fiber: Number(cells[idx('fiber')] ?? 0)
            };
          });
          setFoods(parsed);
        } else {
          const data = JSON.parse(String(reader.result));
          if (!Array.isArray(data)) throw new Error('JSON deve ser um array');
          setFoods(data as Food[]);
        }
        push('Banco de alimentos importado');
      } catch (error) {
        window.alert(`Falha ao importar arquivo: ${(error as Error).message}`);
      }
    };
    reader.readAsText(file);
  };

  const addManualFood = (food: Food) => {
    setFoods((prev) => [food, ...prev]);
    push('Alimento adicionado');
  };

  const addProfile = (profile: Profile) => {
    setProfiles((prev) => [profile, ...prev]);
    push('Perfil criado');
  };

  const removeProfile = (id: string) => {
    setProfiles((prev) => prev.filter((profile) => profile.id !== id));
    setPlans((prev) => prev.map((plan) => (plan.clientId === id ? { ...plan, clientId: null, client: '', profileId: null } : plan)));
    push('Perfil removido');
  };

  const assignTemplateToClient = (templateId: string, profile: Profile) => {
    const template = plans.find((plan) => plan.id === templateId && plan.isTemplate);
    if (!template) return;
    const clone = clonePlan(template);
    clone.id = genId();
    clone.isTemplate = false;
    clone.clientId = profile.id;
    clone.client = profile.name;
    clone.title = `${template.title} — ${profile.name}`;
    clone.sourceTemplateId = template.id;
    setPlans((prev) => [clone, ...prev]);
    setCurrentPlanId(clone.id);
    setUi((prev) => ({ ...prev, route: 'plans' }));
    push('Template atribuído ao cliente');
  };

  return (
    <div style={{ ['--primary' as string]: theme.primary, ['--text' as string]: theme.text, ['--bg' as string]: theme.bg, ['--card' as string]: theme.card, ['--input' as string]: theme.input, ['--border' as string]: theme.border }} className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <style>{globalStyles(theme)}</style>

      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[#0b0b0c]/80 backdrop-blur">
        <div className="flex items-center gap-2 px-3 py-2">
          <SidebarTrigger open={ui.sidebarOpen} onToggle={(value) => setUi((prev) => ({ ...prev, sidebarOpen: value }))} />
          {theme.logoDataUrl ? (
            <img src={theme.logoDataUrl} alt="logo" className="h-8 w-8 rounded-xl object-contain" />
          ) : (
            <div className="h-8 w-8 rounded-xl bg-[var(--primary)]" />
          )}
          <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--title-font)' }}>
            AKT Diet Builder — Wireframe
          </h1>

          <div className="ml-auto flex items-center gap-2">
            <select
              className="rounded-lg px-2 py-1"
              value={currentPlanId ?? ''}
              onChange={(event) => setCurrentPlanId(event.target.value || null)}
            >
              {filteredPlans.length === 0 ? <option value="">Sem planos</option> : null}
              {filteredPlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.isTemplate ? `${TEMPLATE_ICON} ` : ''}
                  {plan.title}
                </option>
              ))}
            </select>

            <details className="relative">
              <summary className="btn cursor-pointer select-none">+ Novo</summary>
              <div className="absolute right-0 mt-1 w-44 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1">
                <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-[var(--input)]" onClick={() => createPlan(false)}>
                  Plano
                </button>
                <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-[var(--input)]" onClick={() => createPlan(true)}>
                  Template
                </button>
              </div>
            </details>

            <details className="relative">
              <summary className="btn cursor-pointer select-none">Ações</summary>
              <div className="absolute right-0 mt-1 w-56 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1">
                <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-[var(--input)]" onClick={duplicatePlan} disabled={!currentPlan}>
                  Duplicar
                </button>
                <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-[var(--input)]" onClick={deleteCurrentPlan} disabled={!currentPlan}>
                  Excluir
                </button>
                <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-[var(--input)]" onClick={convertToTemplate} disabled={!currentPlan}>
                  Converter → Template
                </button>
                <div className="px-3 py-1 text-xs opacity-70">Atribuir a perfil</div>
                <div className="px-2 pb-2">
                  <select
                    className="w-full rounded-lg px-2 py-1"
                    value={currentPlan?.clientId ?? ''}
                    onChange={(event) => assignToProfile(currentPlan!, event.target.value || null)}
                    disabled={!currentPlan}
                  >
                    <option value="">Sem perfil</option>
                    {profiles.map((profile) => (
                      <option key={profile.id} value={profile.id}>
                        {profile.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </details>

            <details className="relative">
              <summary className="btn cursor-pointer select-none">Exportar</summary>
              <div className="absolute right-0 mt-1 w-48 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1">
                <button
                  className="w-full rounded-lg px-3 py-2 text-left hover:bg-[var(--input)]"
                  onClick={() => currentPlan && window.open(`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(currentPlan, null, 2))}`)}
                >
                  JSON
                </button>
                <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-[var(--input)]" onClick={() => window.print()}>
                  PDF
                </button>
              </div>
            </details>

            <button className="btn" onClick={() => setUi((prev) => ({ ...prev, showSettingsModal: true }))}>
              ⚙️
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <Sidebar
          open={ui.sidebarOpen}
          route={ui.route}
          onToggle={(value) => setUi((prev) => ({ ...prev, sidebarOpen: value }))}
          onNavigate={(route) => setUi((prev) => ({ ...prev, route }))}
        />
        <main className="flex-1 p-4 lg:p-6">
          {ui.route === 'clients' ? (
            <ClientsPage
              profiles={profiles}
              plans={plans}
              onCreateProfile={addProfile}
              onDeleteProfile={removeProfile}
              onAssignTemplate={assignTemplateToClient}
            />
          ) : null}
          {ui.route === 'plans' ? (
            <PlansPage
              plan={currentPlan}
              foods={foods}
              totals={totals}
              filters={filters}
              theme={theme}
              plans={filteredPlans}
              profiles={profiles}
              favs={favs}
              onChangeFilters={setFilters}
              onSelectPlan={setCurrentPlanId}
              onPlanField={setPlanField}
              onConvertToTemplate={convertToTemplate}
              onUpdateMeal={updateMeal}
              onRemoveMeal={removeMeal}
              onAddMeal={addMeal}
              toggleFav={toggleFav}
            />
          ) : null}
          {ui.route === 'database' ? (
            <FoodsPage foods={foods} favs={favs} onToggleFav={toggleFav} onImportFoods={handleImportFoods} onAddFood={addManualFood} />
          ) : null}
          {ui.route === 'settings' ? (
            <SettingsPage theme={theme} profiles={profiles} onThemeChange={setTheme} onAddProfile={addProfile} onRemoveProfile={removeProfile} />
          ) : null}
        </main>
      </div>

      <SettingsModal open={ui.showSettingsModal} theme={theme} onChange={setTheme} onClose={() => setUi((prev) => ({ ...prev, showSettingsModal: false }))} />
      <ToastStack messages={messages} onClose={dismiss} />
    </div>
  );
}
