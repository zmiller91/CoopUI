'use client'

import React, {createContext, useContext, useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'


type AppBarState = {
    title?: string;
    setTitle: (title?: string) => void;
};

const AppBarContext = createContext<AppBarState | null>(null);

export function AppBarProvider({ children }: { children: React.ReactNode }) {
    const [title, setTitle] = useState<string | undefined>();

    return (
        <AppBarContext.Provider value={{ title, setTitle }}>
            {children}
        </AppBarContext.Provider>
    );
}

export function useAppBar() {
    const ctx = useContext(AppBarContext);
    if (!ctx) throw new Error("useAppBar must be used inside AppBarProvider");
    return ctx;
}

/**
 * Declaratively sets the AppBar title while the component is mounted.
 * Resets to default (undefined) on unmount.
 */
export function usePageTitle(title?: string) {
    const { setTitle } = useAppBar();

    useEffect(() => {
        setTitle(title);
        return () => setTitle(undefined);
    }, [title, setTitle]);
}

export function AppBar(props: AppBarProps) {
    return (
        <header
            className="
            sticky top-0 z-20
            h-[56px]
            bg-neutral-50
             border-b border-neutral-200
        ">
            <div className="h-full px-4 flex items-center gap-4">
                {props.onNavToggle && (
                    <button
                        onClick={props.onNavToggle}
                        className="text-neutral-600 hover:text-neutral-800"
                        aria-label="Toggle navigation"
                    >
                        <FontAwesomeIcon icon={faBars} className="h-[20px]" />
                    </button>
                )}

                <h1 className="text-base font-semibold text-neutral-900">
                    {props.title}
                </h1>
            </div>
        </header>
    )
}

export interface AppBarProps {
    title: string
    onNavToggle?: () => void
}