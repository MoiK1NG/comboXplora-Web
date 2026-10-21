"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLang } from '../../app/lang-context';
import T from '../../lib/translations';

function InstagramIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    );
}

function WhatsAppIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
    );
}

export function Footer() {
    const { lang } = useLang();
    return (
        <footer className="bg-white text-gray-800 pt-20 pb-10 px-6 lg:px-8 border-t border-gray-100">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-10 mb-16">
                {/* Brand */}
                <div className="md:col-span-1">
                    <div className="relative h-[4.5rem] w-52 mb-8">
                        <Image
                            src="/logos/logo_principal.png"
                            alt="ComboXplora Logo"
                            fill
                            className="object-contain object-left"
                        />
                    </div>
                    <p className="font-sans text-gray-600 mb-8 leading-relaxed text-balance">
                        {T.footer.tagline[lang]}
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h4 className="font-outfit font-black text-xl mb-6 text-gray-900 tracking-wide">{T.footer.platform[lang]}</h4>
                    <ul className="space-y-4 font-sans text-gray-600 font-medium">
                        <li><Link href="/experiencias" className="hover:text-primary transition-colors">{T.footer.experiences[lang]}</Link></li>
                        <li><Link href="/mapa-cultural" className="hover:text-primary transition-colors">{T.footer.culturalMap[lang]}</Link></li>
                        <li><Link href="/eventos" className="hover:text-primary transition-colors">{T.footer.agenda[lang]}</Link></li>
                        <li><Link href="/hacedores" className="hover:text-primary transition-colors">{T.footer.makers[lang]}</Link></li>
                        <li><Link href="/empresas" className="hover:text-primary transition-colors">{T.footer.companies[lang]}</Link></li>
                        <li><Link href="/hacedores/unete" className="hover:text-primary transition-colors">{T.footer.joinMakers[lang]}</Link></li>
                        <li><Link href="/postula-tu-experiencia" className="hover:text-primary transition-colors">{T.footer.submit[lang]}</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="font-outfit font-black text-xl mb-6 text-gray-900 tracking-wide">{T.footer.legal[lang]}</h4>
                    <ul className="space-y-4 font-sans text-gray-600 font-medium">
                        <li><Link href="/terminos-y-condiciones" className="hover:text-primary transition-colors">{T.footer.terms[lang]}</Link></li>
                        <li><Link href="/politica-de-privacidad" className="hover:text-primary transition-colors">{T.footer.privacy[lang]}</Link></li>
                        <li><Link href="/politicas-de-cancelacion" className="hover:text-primary transition-colors">{T.footer.cancellation[lang]}</Link></li>
                        <li><Link href="/tratamiento-de-datos" className="hover:text-primary transition-colors">{T.footer.dataPolicy[lang]}</Link></li>
                    </ul>
                </div>

                {/* Social & Contact */}
                <div>
                    <h4 className="font-outfit font-black text-xl mb-6 text-gray-900 tracking-wide">{T.footer.connect[lang]}</h4>
                    <p className="font-sans text-gray-600 mb-6 font-medium">
                        comboxplora@gmail.com
                    </p>
                    <div className="flex space-x-4">
                        <a
                            href="https://www.instagram.com/comboxplora/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram ComboXplora"
                            className="w-12 h-12 rounded-full border border-gray-200 bg-[#FAFAFA] flex items-center justify-center hover:bg-[#E1306C] hover:border-[#E1306C] hover:text-white transition-all duration-300 text-gray-600 shadow-sm active:scale-95"
                        >
                            <InstagramIcon />
                        </a>
                        <a
                            href="https://wa.me/573122475789"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp ComboXplora"
                            className="w-12 h-12 rounded-full border border-gray-200 bg-[#FAFAFA] flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition-all duration-300 text-gray-600 shadow-sm active:scale-95"
                        >
                            <WhatsAppIcon />
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center font-sans text-sm text-gray-500 gap-4 font-medium">
                <p>© {new Date().getFullYear()} ComboXplora. {T.footer.rights[lang]}</p>
                <p>{T.footer.made[lang]}</p>
            </div>
        </footer>
    );
}
