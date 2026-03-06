import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-sans tracking-wide rounded-full transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-primary text-black font-semibold hover:bg-[#E3B527] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1",
        secondary: "bg-white border-2 border-accent text-accent font-semibold hover:bg-accent hover:text-white shadow-md shadow-accent/10 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1",
        ghost: "bg-transparent text-gray-700 hover:text-black hover:bg-black/5"
    };

    const sizes = {
        sm: "px-5 py-2.5 text-sm",
        md: "px-7 py-3.5 text-base",
        lg: "px-9 py-4 text-lg"
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {children}
        </button>
    );
}
