"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useLang } from '../../app/lang-context';
import T from '../../lib/translations';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { lang, toggleLang } = useLang();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: T.nav.home[lang],        href: '/' },
        { name: T.nav.experiences[lang], href: '/experiencias' },
        { name: T.nav.culturalMap[lang], href: '/mapa-cultural' },
        { name: T.nav.makers[lang],      href: '/hacedores' },
        { name: T.nav.submit[lang],      href: '/postula-tu-experiencia' },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="relative h-12 w-48 sm:w-52">
                    <Image
                        src="/logos/logo_principal.png"
                        alt="ComboXplora Logo"
                        fill
                        className="object-contain object-left drop-shadow-sm transition-transform hover:scale-[1.02] duration-300"
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
                    {/* Language toggle */}
                    <button
                        onClick={toggleLang}
                        title={lang === "es" ? "Switch to English" : "Cambiar a Español"}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border transition-all ${isScrolled ? 'border-gray-200 text-gray-700 hover:border-gray-400' : 'border-gray-300/60 text-gray-800 hover:border-gray-500'}`}
                    >
                        <span>{lang === "es" ? "🇺🇸 EN" : "🇨🇴 ES"}</span>
                    </button>
                    <Link href="/#experiencias">
                        <Button variant="primary" size="sm">
                            {T.nav.startExploring[lang]}
                        </Button>
                    </Link>
                </div>

                {/* Mobile: lang toggle + menu button */}
                <div className="md:hidden flex items-center gap-3">
                    <button
                        onClick={toggleLang}
                        className="text-xs font-black px-2 py-1 rounded-full border border-gray-300 text-gray-700"
                    >
                        {lang === "es" ? "EN" : "ES"}
                    </button>
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
                        <Link href="/#experiencias" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="primary" className="w-full">
                                {T.nav.startExploring[lang]}
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
