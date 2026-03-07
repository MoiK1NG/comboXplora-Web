import { Navbar } from "@/components/layouts/Navbar";
import { Footer } from "@/components/layouts/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { ExperiencesSection } from "@/components/sections/ExperiencesSection";
import { SocialImpactSection } from "@/components/sections/SocialImpactSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { MapaCulturalSection } from "@/components/sections/MapaCulturalSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col w-full selection:bg-primary selection:text-black">
      <Navbar />

      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <HowItWorksSection />
        <ExperiencesSection />
        <SocialImpactSection />
        <MapaCulturalSection />
        <CommunitySection />
        <TestimonialsSection />
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}
