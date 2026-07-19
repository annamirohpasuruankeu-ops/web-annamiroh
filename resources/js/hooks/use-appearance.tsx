import { useSyncExternalStore } from 'react';

export type ResolvedAppearance = 'light' | 'dark';
export type Appearance = ResolvedAppearance | 'system';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: (mode: Appearance) => void;
};

const listeners = new Set<() => void>();

export function initializeTheme(): void {
    if (typeof window === 'undefined') {
        return;
    }

    // Always force light mode
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
    localStorage.setItem('appearance', 'light');
    document.cookie = `appearance=light;path=/;max-age=31536000;SameSite=Lax`;
}

export function useAppearance(): UseAppearanceReturn {
    // We mock the return to always be light
    const appearance: Appearance = 'light';
    const resolvedAppearance: ResolvedAppearance = 'light';

    const updateAppearance = (mode: Appearance): void => {
        // Do nothing, force light
    };

    return { appearance, resolvedAppearance, updateAppearance } as const;
}
