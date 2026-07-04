import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  const baseClass = "sharp-corner font-bold uppercase transition-all duration-200 active:translate-y-1 active:translate-x-1 active:shadow-none inline-flex items-center justify-center transform -skew-x-6";
  
  const variantClass = variant === 'primary' 
    ? "bg-[var(--color-primary)] text-[var(--color-white)] hard-shadow border-4 border-[var(--color-black)] hover:bg-[var(--color-black)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]"
    : "bg-[var(--color-black)] text-[var(--color-white)] hard-shadow-white border-4 border-[var(--color-white)] hover:bg-[var(--color-white)] hover:text-[var(--color-black)]";
    
  return (
    <button 
      className={`${baseClass} ${variantClass} px-8 py-3 text-xl sm:text-2xl ${className}`}
      {...props}
    >
      <span className="skew-x-6 inline-block">{children}</span>
    </button>
  );
};
