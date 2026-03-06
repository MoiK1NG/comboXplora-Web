import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-sans tracking-wide rounded-full transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-primary text-black font-semibold hover:bg-yellow-400 hover:shadow-[0_8px_20px_rgba(244,196,48,0.3)] hover:-translate-y-0.5",
        secondary: "border-2 border-accent text-accent font-semibold hover:bg-accent hover:text-white hover:shadow-[0_8px_20px_rgba(42,157,143,0.3)] hover:-translate-y-0.5",
        ghost: "bg-transparent text-foreground hover:bg-black/5 dark:hover:bg-white/10"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {children}
        </button>
    );
}
