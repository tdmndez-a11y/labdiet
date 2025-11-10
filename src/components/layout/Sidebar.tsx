import type { UIState } from '@/types';

const NAV_ITEMS: { key: UIState['route']; label: string; icon: string }[] = [
  { key: 'clients', label: 'Clientes', icon: '👤' },
  { key: 'plans', label: 'Planos', icon: '📄' },
  { key: 'database', label: 'Banco de dados', icon: '📚' },
  { key: 'settings', label: 'Configurações', icon: '⚙️' }
];

interface SidebarProps {
  open: boolean;
  route: UIState['route'];
  onToggle: (value: boolean) => void;
  onNavigate: (route: UIState['route']) => void;
}

export function Sidebar({ open, route, onToggle, onNavigate }: SidebarProps) {
  return (
    <aside
      className={`border-r border-[var(--border)] bg-[var(--card)] transition-all ${open ? 'w-64' : 'w-16'} fixed top-0 z-30 h-full lg:static`}
    >
      <div className="flex h-14 items-center gap-2 px-3">
        <button className="btn" onClick={() => onToggle(!open)} aria-label="Alternar menu">
          {open ? '⟨' : '☰'}
        </button>
        {open ? <span className="font-semibold">Menu</span> : null}
      </div>
      <nav className="space-y-1 p-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left transition ${
              route === item.key
                ? 'border-[var(--primary)] bg-[var(--input)]'
                : 'border-[var(--border)] hover:border-[var(--primary)]'
            }`}
          >
            <span className="w-6 text-center">{item.icon}</span>
            {open ? item.label : null}
          </button>
        ))}
      </nav>
      {!open ? <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] opacity-60">AKT</p> : null}
    </aside>
  );
}
