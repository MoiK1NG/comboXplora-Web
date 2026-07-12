"use client";

import {
    createContext, useContext, useState, useCallback,
    useEffect, ReactNode,
} from "react";
import type { Lang } from "../lib/translations";

const LANGS: Lang[] = ["es", "en", "fr", "pt"];

interface LangCtx {
    lang: Lang;
    setLang: (l: Lang) => void;
}

const LangContext = createContext<LangCtx>({ lang: "es", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>("es");

    useEffect(() => {
        const stored = localStorage.getItem("comboxplora_lang") as Lang | null;
        if (stored && (LANGS as string[]).includes(stored)) setLangState(stored);
    }, []);

    const setLang = useCallback((l: Lang) => {
        setLangState(l);
        localStorage.setItem("comboxplora_lang", l);
        document.cookie = `lang=${l};path=/;max-age=31536000;SameSite=Lax`;
    }, []);

    return (
        <LangContext.Provider value={{ lang, setLang }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    return useContext(LangContext);
}
