import type { FiltersState, Profile } from '@/types';

interface FiltersBarProps {
  filters: FiltersState;
  profiles: Profile[];
  onChange: (filters: FiltersState) => void;
  compact?: boolean;
}

export function FiltersBar({ filters, profiles, onChange, compact = false }: FiltersBarProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? 'mb-2' : 'mb-3'}`}>
      <input
        placeholder="Buscar por título..."
        className="flex-1 rounded-lg px-2 py-1"
        value={filters.q}
        onChange={(event) => onChange({ ...filters, q: event.target.value })}
      />
      <select
        className="rounded-lg px-2 py-1"
        value={filters.clientId}
        onChange={(event) => onChange({ ...filters, clientId: event.target.value })}
      >
        <option value="">Todos os clientes</option>
        {profiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.name}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--input)] px-2 py-1 text-sm">
        <input
          type="checkbox"
          checked={filters.onlyTemplates}
          onChange={(event) => onChange({ ...filters, onlyTemplates: event.target.checked })}
        />
        Apenas templates
      </label>
    </div>
  );
}
