import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-sans tracking-wide rounded-full transition-all duration-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group";

    const variants = {
        primary: "bg-primary text-black font-semibold hover:bg-black hover:text-primary shadow-[0_8px_20px_-6px_rgba(244,196,48,0.5)] hover:shadow-[0_15px_30px_-5px_rgba(244,196,48,0.4)] hover:-translate-y-1 border border-transparent",
        secondary: "bg-white border text-gray-900 font-semibold hover:border-black shadow-[0_4px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] hover:-translate-y-1",
        ghost: "bg-transparent text-gray-600 font-medium hover:text-black hover:bg-gray-50"
    };

    const sizes = {
        sm: "px-6 py-2.5 text-sm",
        md: "px-8 py-3.5 text-base",
        lg: "px-10 py-4 text-lg",
        icon: "p-3"
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            <span className="relative z-10 flex items-center gap-2">{children}</span>
            {variant === 'primary' && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
            )}
        </button>
    );
}
