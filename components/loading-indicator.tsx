'use client'

import React from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'

export interface LoadingIndicatorProps {
    isLoading: boolean
}

/**
 * Shows a linear loading bar directly under the AppBar (56px).
 * Matches Material behavior and accessibility.
 */
export default function LoadingIndicator({ isLoading }: LoadingIndicatorProps) {
    if (!isLoading) return null

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 56, // AppBar height on mobile
                left: 0,
                right: 0,
                zIndex: (theme) => theme.zIndex.appBar + 1,
            }}
        >
            <LinearProgress />
        </Box>
    )
}
