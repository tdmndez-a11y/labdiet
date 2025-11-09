import { MACRO_KEYS } from '@/utils/macros';

interface TotalsCardProps {
  totals: Record<string, number>;
}

export function TotalsCard({ totals }: TotalsCardProps) {
  return (
    <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
      {MACRO_KEYS.map((macro) => (
        <div key={macro} className="rounded-xl border border-[var(--border)] bg-[var(--input)] px-3 py-2">
          <p className="text-xs uppercase tracking-wide opacity-60">{macro}</p>
          <p className="text-lg font-semibold">{totals[macro] ?? 0}</p>
        </div>
      ))}
    </div>
  );
}
