import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'outline' };
export const Button: React.FC<Props> = ({ className = "", variant = 'primary', children, ...rest }) => {
  const base = "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition";
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700",
    ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100",
    outline: "border border-neutral-200 text-neutral-900 hover:bg-neutral-50"
  } as const;
  return <button className={`${base} ${variants[variant]} ${className}`} {...rest}>{children}</button>;
};
