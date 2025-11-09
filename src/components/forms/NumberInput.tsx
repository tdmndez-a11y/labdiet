import type { ChangeEvent } from 'react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  className?: string;
}

export function NumberInput({ value, onChange, step = 1, min = 0, className }: NumberInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    onChange(next ? Number(next) : 0);
  };

  return (
    <input
      type="number"
      className={`w-24 rounded-lg px-2 py-1 ${className ?? ''}`}
      value={Number.isFinite(value) ? value : 0}
      step={step}
      min={min}
      onChange={handleChange}
    />
  );
}
