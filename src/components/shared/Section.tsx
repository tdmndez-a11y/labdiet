import type { PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';

interface SectionProps {
  title: string;
  right?: ReactNode;
  sticky?: boolean;
  className?: string;
}

export function Section({ title, right, sticky = false, className, children }: PropsWithChildren<SectionProps>) {
  return (
    <section
      className={clsx(
        'mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-surface',
        sticky && 'sticky top-[76px] z-10 backdrop-blur',
        className
      )}
    >
      <header className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--subtitle-font)' }}>
          {title}
        </h2>
        {right ? <div className="flex shrink-0 items-center gap-2">{right}</div> : null}
      </header>
      {children}
    </section>
  );
}
