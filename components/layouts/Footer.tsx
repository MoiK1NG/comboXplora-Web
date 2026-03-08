import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
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
                        Conectando locales y turistas en auténticas experiencias culturales en Barranquilla, apoyando la economía de hacedores locales.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h4 className="font-outfit font-black text-xl mb-6 text-gray-900 tracking-wide">Plataforma</h4>
                    <ul className="space-y-4 font-sans text-gray-600 font-medium">
                        <li><Link href="#como-funciona" className="hover:text-primary transition-colors">Cómo Funciona</Link></li>
                        <li><Link href="#experiencias" className="hover:text-primary transition-colors">Experiencias</Link></li>
                        <li><Link href="#impacto" className="hover:text-primary transition-colors">Impacto Social</Link></li>
                        <li><Link href="#comunidad" className="hover:text-primary transition-colors">Comunidad</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="font-outfit font-black text-xl mb-6 text-gray-900 tracking-wide">Legal</h4>
                    <ul className="space-y-4 font-sans text-gray-600 font-medium">
                        <li><Link href="#" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
                        <li><Link href="#" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
                        <li><Link href="#" className="hover:text-primary transition-colors">Políticas de Cancelación</Link></li>
                    </ul>
                </div>

                {/* Social & Contact */}
                <div>
                    <h4 className="font-outfit font-black text-xl mb-6 text-gray-900 tracking-wide">Conecta</h4>
                    <p className="font-sans text-gray-600 mb-6 font-medium">
                        hola@comboxplora.com
                    </p>
                    <div className="flex space-x-4">
                        <div className="w-12 h-12 rounded-full border border-gray-200 bg-[#FAFAFA] flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 cursor-pointer text-gray-600 shadow-sm active:scale-95">
                            <span className="font-bold text-sm">IG</span>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-gray-200 bg-[#FAFAFA] flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 cursor-pointer text-gray-600 shadow-sm active:scale-95">
                            <span className="font-bold text-sm">FB</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center font-sans text-sm text-gray-500 gap-4 font-medium">
                <p>© {new Date().getFullYear()} ComboXplora. Todos los derechos reservados.</p>
                <p>Hecho con ❤️ en Barranquilla, Colombia</p>
            </div>
        </footer>
    );
}
