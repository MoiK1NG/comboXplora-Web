import React from 'react';
import Image from 'next/image';
import { Navbar } from '../../../components/layouts/Navbar';
import { Footer } from '../../../components/layouts/Footer';
import { Button } from '../../../components/ui/Button';
import { Clock, MapPin, CheckCircle } from 'lucide-react';

export default function PicoteraPage() {
    return (
        <div className="min-h-screen flex flex-col w-full selection:bg-primary selection:text-black bg-[#fafafa]">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 max-w-5xl mx-auto px-6 lg:px-8">
                <div className="relative w-full h-[500px] rounded-[3rem] overflow-hidden mb-12 shadow-xl border-8 border-white">
                    <Image src="/images/experiencias/picotera/hero.jpg" alt="Cultura Picotera" fill className="object-cover" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    <div className="md:col-span-2">
                        <div className="inline-flex px-4 py-1.5 rounded-full bg-primary/20 text-yellow-900 font-bold text-xs uppercase tracking-widest mb-6">Música</div>
                        <h1 className="font-outfit text-5xl font-black text-gray-900 mb-6 leading-tight">Cultura Picotera – experiencia musical en Las Nieves</h1>

                        <p className="font-sans text-[1.15rem] leading-[1.8] text-gray-600 mb-10">
                            Vive una experiencia musical y de baile auténtica en los barrios populares. Siente la fuerza del bajo de un verdadero &quot;Picó&quot; (Sound System Caribeño), conoce a los coleccionistas de vinilos afroantillanos y aprende los pases clave de la verbena y la champeta.
                        </p>

                        <h3 className="font-outfit text-2xl font-black text-gray-900 mb-4">¿Qué incluye la experiencia?</h3>
                        <ul className="space-y-4 font-sans text-gray-600 mb-10">
                            <li className="flex items-start gap-3"><CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} /> Taller práctico de baile verbenero y champeta.</li>
                            <li className="flex items-start gap-3"><CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} /> Charla con dueños y pintores de Picós tradicionales.</li>
                            <li className="flex items-start gap-3"><CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} /> Degustación de cerveza fría local o jugo tradicional.</li>
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
                                        <p className="font-medium text-gray-900">5 horas</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin size={20} className="text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Lugar</p>
                                        <p className="font-medium text-gray-900">Las Nieves / B/quilla</p>
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
