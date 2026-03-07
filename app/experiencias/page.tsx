import React from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/layouts/Navbar';
import { Footer } from '../../components/layouts/Footer';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { ExperiencesSection } from '../../components/sections/ExperiencesSection';

export default function ExperienciasPage() {
    return (
        <div className="min-h-screen flex flex-col w-full selection:bg-primary selection:text-black">
            <Navbar />

            <main className="flex-grow pt-32 pb-20">
                <ExperiencesSection />
            </main>

            <Footer />
        </div>
    );
}
