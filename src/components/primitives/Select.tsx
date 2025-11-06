import React from "react";

type Option = { value: string; label: string };
type Props = {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  ariaLabel?: string;
  className?: string;
};

export const Select: React.FC<Props> = ({ value, onChange, options, ariaLabel, className }) => (
  <select
    className={`rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${className ?? ""}`}
    value={value}
    aria-label={ariaLabel}
    onChange={(e) => onChange(e.target.value)}
  >
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);
