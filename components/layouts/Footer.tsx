import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-zinc-950 text-white pt-16 pb-8 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
                {/* Brand */}
                <div className="md:col-span-1">
                    <div className="relative h-12 w-48 mb-6">
                        <Image
                            src="/logos/ComboXplora-06.png"
                            alt="ComboXplora Logo"
                            fill
                            className="object-contain object-left invert"
                        />
                    </div>
                    <p className="font-sans text-gray-400 mb-6">
                        Conectando locales y turistas en auténticas experiencias culturales en Barranquilla, apoyando la economía de hacedores locales.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h4 className="font-outfit font-bold text-lg mb-6 text-primary">Plataforma</h4>
                    <ul className="space-y-4 font-sans text-gray-400">
                        <li><Link href="#como-funciona" className="hover:text-white transition-colors">Cómo Funciona</Link></li>
                        <li><Link href="#experiencias" className="hover:text-white transition-colors">Experiencias</Link></li>
                        <li><Link href="#impacto" className="hover:text-white transition-colors">Impacto Social</Link></li>
                        <li><Link href="#comunidad" className="hover:text-white transition-colors">Comunidad</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="font-outfit font-bold text-lg mb-6 text-primary">Legal</h4>
                    <ul className="space-y-4 font-sans text-gray-400">
                        <li><Link href="#" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Políticas de Cancelación</Link></li>
                    </ul>
                </div>

                {/* Social & Contact */}
                <div>
                    <h4 className="font-outfit font-bold text-lg mb-6 text-primary">Conecta</h4>
                    <p className="font-sans text-gray-400 mb-4">
                        hola@comboxplora.com
                    </p>
                    <div className="flex space-x-4">
                        {/* Social Icons Placeholders */}
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary hover:text-black transition-colors cursor-pointer">
                            <span>IG</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary hover:text-black transition-colors cursor-pointer">
                            <span>FB</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-primary hover:text-black transition-colors cursor-pointer">
                            <span>TW</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center font-sans text-sm text-gray-500 gap-4">
                <p>© {new Date().getFullYear()} ComboXplora. Todos los derechos reservados.</p>
                <p>Hecho con ❤️ en Barranquilla, Colombia</p>
            </div>
        </footer>
    );
}
