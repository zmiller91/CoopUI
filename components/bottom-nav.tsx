'use client'

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Paper from '@mui/material/Paper'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

export type BottomNavItem = {
    path: string
    label: string
    icon: React.ReactElement
}

export function BottomNav({ items }: { items: BottomNavItem[] }) {
    const router = useRouter()
    const pathname = usePathname()

    // Pick the "active" tab by prefix match (like your startsWith)
    const value = React.useMemo(() => {
        const idx = items.findIndex((i) => pathname.startsWith(i.path))
        return idx === -1 ? 0 : idx
    }, [items, pathname])

    return (
        <Paper
            elevation={3}
            sx={{
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: (t) => t.zIndex.appBar, // stays above content
                borderTop: 1,
                borderColor: 'divider',
                pb: 'env(safe-area-inset-bottom)',
            }}
        >
            <BottomNavigation
                showLabels
                value={value}
                onChange={(_, newValue: number) => router.push(items[newValue].path)}
                sx={{
                    minWidth: 0,
                    px: 0.5,
                    '& .MuiBottomNavigationAction-label': {
                        fontSize: '0.7rem',
                        lineHeight: 1.1,
                        whiteSpace: 'nowrap',
                    },
                    '& .MuiSvgIcon-root': {
                        fontSize: 24, // keep standard
                    },
                }}
            >
                {items.map((item) => (
                    <BottomNavigationAction
                        key={item.path}
                        label={item.label}
                        icon={item.icon}
                    />
                ))}
            </BottomNavigation>
        </Paper>
    )
}