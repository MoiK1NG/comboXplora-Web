import React from 'react';
import Image from 'next/image';
import { Navbar } from '../../../components/layouts/Navbar';
import { Footer } from '../../../components/layouts/Footer';
import { Button } from '../../../components/ui/Button';
import { Clock, MapPin, CheckCircle } from 'lucide-react';

export default function MacondoPage() {
    return (
        <div className="min-h-screen flex flex-col w-full selection:bg-primary selection:text-black bg-[#fafafa]">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 max-w-5xl mx-auto px-6 lg:px-8">
                <div className="relative w-full h-[500px] rounded-[3rem] overflow-hidden mb-12 shadow-xl border-8 border-white">
                    <Image src="/images/authentic/exp_macondo.jpg" alt="Macondo en Barranquilla" fill className="object-cover" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="md:col-span-2">
                        <div className="inline-flex px-4 py-1.5 rounded-full bg-primary/20 text-yellow-900 font-bold text-xs uppercase tracking-widest mb-6">Historia</div>
                        <h1 className="font-outfit text-5xl font-black text-gray-900 mb-6 leading-tight">Macondo en Barranquilla – recorrido literario</h1>

                        <p className="font-sans text-[1.15rem] leading-[1.8] text-gray-600 mb-10">
                            Recorrido literario y nostálgico inspirado en las huellas de Gabriel García Márquez. Camina por las mismas calles del Barrio El Prado y el Centro Histórico donde el Nobel de literatura concibió algunas de sus historias más icónicas junto al Grupo de Barranquilla.
                        </p>

                        <h3 className="font-outfit text-2xl font-black text-gray-900 mb-4">¿Qué incluye la experiencia?</h3>
                        <ul className="space-y-4 font-sans text-gray-600 mb-10">
                            <li className="flex items-start gap-3"><CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} /> Tour peatonal guiado por el Centro y El Prado.</li>
                            <li className="flex items-start gap-3"><CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} /> Taza de café especial en un café patrimonial.</li>
                            <li className="flex items-start gap-3"><CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} /> Lectura de pequeños fragmentos de las obras de Gabo en sitios clave.</li>
                        </ul>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-gray-100 sticky top-40">
                            <h3 className="font-outfit text-2xl font-black text-gray-900 mb-6">Detalles</h3>

                            <div className="space-y-6 mb-8 text-gray-600 font-sans">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Clock size={20} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Duración</p>
                                        <p className="font-medium text-gray-900">3 horas</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin size={20} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Lugar</p>
                                        <p className="font-medium text-gray-900">El Prado / Centro Histórico</p>
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full h-14 text-lg">Reservar Ahora</Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
