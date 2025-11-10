import type { ChangeEvent } from 'react';

interface TextFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}

export function TextField({ label, value, onChange, type = 'text', placeholder }: TextFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="opacity-80">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="rounded-xl px-3 py-2"
        value={value}
        onChange={handleChange}
      />
    </label>
  );
}
