import React from 'react';
import { Navbar } from '../../components/layouts/Navbar';
import { Footer } from '../../components/layouts/Footer';
import { MapaCulturalSection } from '../../components/sections/MapaCulturalSection';

export default function MapaCulturalPage() {
    return (
        <div className="min-h-screen flex flex-col w-full selection:bg-primary selection:text-black bg-gray-50">
            <Navbar />

            <main className="flex-grow pt-32 pb-20">
                <MapaCulturalSection />
            </main>

            <Footer />
        </div>
    );
}
