"use client";

import {
    createContext, useContext, useState, useCallback, ReactNode,
} from "react";

export interface Change {
    id: string;
    description: string;
    section: string;
    timestamp: Date;
}

interface ChangesCtx {
    changes: Change[];
    addChange: (description: string, section: string) => void;
    clearChanges: () => void;
}

const ChangesContext = createContext<ChangesCtx>({
    changes: [],
    addChange: () => {},
    clearChanges: () => {},
});

export function ChangesProvider({ children }: { children: ReactNode }) {
    const [changes, setChanges] = useState<Change[]>([]);

    const addChange = useCallback((description: string, section: string) => {
        setChanges(prev => [
            ...prev,
            {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                description,
                section,
                timestamp: new Date(),
            },
        ]);
    }, []);

    const clearChanges = useCallback(() => setChanges([]), []);

    return (
        <ChangesContext.Provider value={{ changes, addChange, clearChanges }}>
            {children}
        </ChangesContext.Provider>
    );
}

export function useChanges() {
    return useContext(ChangesContext);
}
