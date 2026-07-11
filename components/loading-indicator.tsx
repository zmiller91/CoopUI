'use client'

import React from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'

export interface LoadingIndicatorProps {
    isLoading: boolean
    /**
     * Whether this page renders an AppBar above this indicator. Mirrors AppContent's
     * adjustForTopNav - pass false on pages (e.g. login) that don't render an AppBar, otherwise the
     * bar renders 56px too low, floating over empty space instead of sitting flush with the top.
     */
    hasAppBar?: boolean
}

/**
 * Shows a linear loading bar directly under the AppBar (56px), or flush with the top of the page when
 * hasAppBar is false. Matches Material behavior and accessibility.
 *
 * z-index is pinned above MUI's highest built-in tier (tooltip, 1500) rather than appBar+1 - appBar+1
 * (1101) sits *below* Dialog/Modal (1300), so this used to render behind an open dialog instead of over
 * it. This way it reliably overlays everything, dialogs included.
 */
export default function LoadingIndicator({ isLoading, hasAppBar = true }: LoadingIndicatorProps) {
    if (!isLoading) return null

    return (
        <Box
            sx={{
                position: 'fixed',
                top: hasAppBar ? 56 : 0,
                left: 0,
                right: 0,
                zIndex: (theme) => theme.zIndex.tooltip + 1,
            }}
        >
            <LinearProgress />
        </Box>
    )
}
