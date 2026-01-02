'use client'

import React, {createContext, useContext, useEffect, useState} from 'react'
import MuiAppBar from '@mui/material/AppBar'
import {Box, IconButton, Toolbar, Typography} from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'


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
        <MuiAppBar
            position="sticky"
            color="default"
            elevation={0}
            sx={{
                borderBottom: 1,
                borderColor: 'divider'
            }}
        >
            <Toolbar
                disableGutters
                sx={{
                    minHeight: 56,
                    px: 2,
                    gap: 1.5,
                }}
            >
                {props.onNavToggle && (
                    <IconButton
                        edge="start"
                        onClick={props.onNavToggle}
                        aria-label="Toggle navigation"
                        sx={{ mr: 0.5 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                <Typography variant="subtitle1" fontWeight={600} noWrap>
                    {props.title}
                </Typography>

                {/* optional: right-side slot later (actions, status, etc.) */}
                <Box sx={{ flexGrow: 1 }} />
            </Toolbar>
        </MuiAppBar>
    )
}

export interface AppBarProps {
    title: string
    onNavToggle?: () => void
}