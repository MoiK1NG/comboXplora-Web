"use client";

import {
    createContext, useContext, useState, useCallback,
    useEffect, ReactNode,
} from "react";
import type { Lang } from "../lib/translations";

interface LangCtx {
    lang: Lang;
    toggleLang: () => void;
}

const LangContext = createContext<LangCtx>({ lang: "es", toggleLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>("es");

    // Restore from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("comboxplora_lang") as Lang | null;
        if (stored === "en" || stored === "es") setLang(stored);
    }, []);

    const toggleLang = useCallback(() => {
        setLang(prev => {
            const next: Lang = prev === "es" ? "en" : "es";
            localStorage.setItem("comboxplora_lang", next);
            // Also set cookie so server components can read it
            document.cookie = `lang=${next};path=/;max-age=31536000;SameSite=Lax`;
            return next;
        });
    }, []);

    return (
        <LangContext.Provider value={{ lang, toggleLang }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    const { lang, toggleLang } = useContext(LangContext);
    return { lang, toggleLang };
}
