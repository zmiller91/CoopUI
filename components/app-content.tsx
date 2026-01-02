'use client'

import React, { ReactNode, useMemo } from 'react'
import Box from '@mui/material/Box'
import LoadingIndicator from './loading-indicator'

export interface AppContentProps {
    adjustForBottomNav?: boolean
    adjustForTopNav?: boolean
    hasLoaded?: boolean
    children: ReactNode
    className?: string
}

/**
 * Assumptions:
 * - Top AppBar is 56px (MUI default for mobile)
 * - BottomNav is 56px
 * If your top is 64px on desktop, you can make this responsive later.
 */
const TOP_NAV_PX = 56
const BOTTOM_NAV_PX = 56

export function AppContent(props: AppContentProps) {
    const adjustBottom = props.adjustForBottomNav ?? true
    const adjustTop = props.adjustForTopNav ?? true

    const topOffset = adjustTop ? TOP_NAV_PX : 0
    const bottomOffset = adjustBottom ? BOTTOM_NAV_PX : 0

    // Height available for the scroll container
    const height = useMemo(() => {
        // safe-area is handled as padding at the bottom (like you had)
        return `calc(100vh - ${topOffset + bottomOffset}px)`
    }, [topOffset, bottomOffset])

    const showChildren = props.hasLoaded === undefined || props.hasLoaded
    const isLoading = props.hasLoaded !== undefined ? !props.hasLoaded : false

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default', // set this in your theme (or use grey.100)
            }}
            className={props.className}
        >
            <LoadingIndicator isLoading={isLoading} />

            <Box
                sx={{
                    height,
                    width: '100vw',
                    overflow: 'auto',
                    px: 2, // ~16px like px-4
                    py: 1.5, // ~12px like py-3
                    // Keep content from being hidden behind bottom nav + iOS safe area
                    pb: adjustBottom ? `calc(${BOTTOM_NAV_PX}px + env(safe-area-inset-bottom))` : undefined,
                }}
            >
                {showChildren && props.children}
            </Box>
        </Box>
    )
}
