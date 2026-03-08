import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ComboXplora | Descubre Barranquilla a Través de su Gente",
  description: "Conecta con locales y turistas en auténticas experiencias culturales en Barranquilla. Turismo inmersivo guiado por hacedores culturales.",
  openGraph: {
    title: "ComboXplora | Experiencias Culturales en Barranquilla",
    description: "Descubre Barranquilla a través de su gente, tradiciones, historias, gastronomía y patrimonio. Únete a nuestra comunidad de exploradores.",
    images: [{ url: "/images/hero_barranquilla_1772729237395.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-foreground bg-background`}>
        {children}
      </body>
    </html>
  );
}
