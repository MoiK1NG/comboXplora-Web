"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Nosotros', href: '#nosotros' },
        { name: 'Cómo Funciona', href: '#como-funciona' },
        { name: 'Experiencias', href: '#experiencias' },
        { name: 'Impacto', href: '#impacto' },
        { name: 'Comunidad', href: '#comunidad' },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="relative h-10 w-48 sm:w-56">
                    <Image
                        src="/logos/ComboXplora_Mesa de trabajo 1.png"
                        alt="ComboXplora Logo"
                        fill
                        className="object-contain object-left"
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`font-sans font-medium hover:text-primary transition-colors ${isScrolled ? 'text-gray-800' : 'text-gray-900 drop-shadow-sm'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Button variant="primary" size="sm">
                        Empieza a explorar
                    </Button>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-gray-900 focus:outline-none"
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col space-y-4 font-sans font-medium text-gray-800">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="py-2 hover:text-primary transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-2 pb-4">
                        <Button variant="primary" className="w-full">
                            Empieza a explorar
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
}
