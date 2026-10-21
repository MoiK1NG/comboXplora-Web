"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { useLang } from '../../app/lang-context';
import T from '../../lib/translations';
import type { Lang } from '../../lib/translations';

const LANG_OPTIONS: { code: Lang; flagCode: string; label: string }[] = [
    { code: "es", flagCode: "co", label: "ES" },
    { code: "en", flagCode: "us", label: "EN" },
    { code: "fr", flagCode: "fr", label: "FR" },
    { code: "pt", flagCode: "br", label: "PT" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const desktopLangRef = useRef<HTMLDivElement>(null);
    const mobileLangRef = useRef<HTMLDivElement>(null);
    const { lang, setLang } = useLang();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            const insideDesktop = desktopLangRef.current?.contains(target);
            const insideMobile = mobileLangRef.current?.contains(target);
            if (!insideDesktop && !insideMobile) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { name: T.nav.home[lang],        href: '/' },
        { name: T.nav.experiences[lang], href: '/experiencias' },
        { name: T.nav.culturalMap[lang], href: '/mapa-cultural' },
        { name: T.nav.agenda[lang],      href: '/eventos' },
        { name: T.nav.makers[lang],      href: '/hacedores' },
        { name: T.nav.companies[lang],   href: '/empresas' },
    ];

    const current = LANG_OPTIONS.find(o => o.code === lang)!;

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
                            key={link.href}
                            href={link.href}
                            className={`font-sans font-medium hover:text-primary transition-colors ${isScrolled ? 'text-gray-800' : 'text-gray-900 drop-shadow-sm'}`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Language dropdown */}
                    <div ref={desktopLangRef} className="relative">
                        <button
                            onClick={() => setIsLangOpen(prev => !prev)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border transition-all ${isScrolled ? 'border-gray-200 text-gray-700 hover:border-gray-400' : 'border-gray-300/60 text-gray-800 hover:border-gray-500'}`}
                        >
                            <img src={`https://flagcdn.com/w20/${current.flagCode}.png`} alt={current.label} className="w-5 h-auto rounded-sm" />
                            <span>{current.label}</span>
                            <ChevronDown size={12} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isLangOpen && (
                            <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 min-w-[100px]">
                                {LANG_OPTIONS.map(opt => (
                                    <button
                                        key={opt.code}
                                        onClick={() => { setLang(opt.code); setIsLangOpen(false); }}
                                        className={`w-full flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors ${lang === opt.code ? 'text-primary bg-primary/5' : 'text-gray-700'}`}
                                    >
                                        <img src={`https://flagcdn.com/w20/${opt.flagCode}.png`} alt={opt.label} className="w-5 h-auto rounded-sm" />
                                        <span>{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link href="/#experiencias">
                        <Button variant="primary" size="sm">
                            {T.nav.startExploring[lang]}
                        </Button>
                    </Link>
                </div>

                {/* Mobile: lang dropdown + menu button */}
                <div className="md:hidden flex items-center gap-3">
                    <div ref={mobileLangRef} className="relative">
                        <button
                            onClick={() => setIsLangOpen(prev => !prev)}
                            className="flex items-center gap-1 text-xs font-black px-2 py-1 rounded-full border border-gray-300 text-gray-700"
                        >
                            <img src={`https://flagcdn.com/w20/${current.flagCode}.png`} alt={current.label} className="w-5 h-auto rounded-sm" />
                            <span>{current.label}</span>
                            <ChevronDown size={10} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isLangOpen && (
                            <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 min-w-[90px]">
                                {LANG_OPTIONS.map(opt => (
                                    <button
                                        key={opt.code}
                                        onClick={() => { setLang(opt.code); setIsLangOpen(false); }}
                                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase hover:bg-gray-50 transition-colors ${lang === opt.code ? 'text-primary bg-primary/5' : 'text-gray-700'}`}
                                    >
                                        <img src={`https://flagcdn.com/w20/${opt.flagCode}.png`} alt={opt.label} className="w-5 h-auto rounded-sm" />
                                        <span>{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
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
                            key={link.href}
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
