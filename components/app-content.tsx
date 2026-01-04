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

const TOP_NAV_PX = 56
const BOTTOM_NAV_PX = 56

export function AppContent(props: AppContentProps) {
    const adjustBottom = props.adjustForBottomNav ?? true
    const adjustTop = props.adjustForTopNav ?? true

    const topOffset = adjustTop ? TOP_NAV_PX : 0
    const bottomOffset = adjustBottom ? BOTTOM_NAV_PX : 0

    const height = useMemo(() => {
        return `calc(100vh - ${topOffset + bottomOffset}px)`
    }, [topOffset, bottomOffset])

    const isLoading = props.hasLoaded !== undefined ? !props.hasLoaded : false

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
            }}
            className={props.className}
        >
            <Box
                sx={{
                    position: 'relative',
                    height,
                    width: '100vw',
                    overflow: 'auto',
                    px: 2,
                    py: 1.5,
                    pb: adjustBottom ? `calc(${BOTTOM_NAV_PX}px + env(safe-area-inset-bottom))` : undefined,
                }}
            >
                {/* ✅ Always mount children so their effects can run */}
                {props.children}

                {/* ✅ Overlay loading indicator without blocking mount */}
                {isLoading && (
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'background.default',
                            opacity: 0.85,
                            zIndex: 10,
                        }}
                    >
                        <LoadingIndicator isLoading />
                    </Box>
                )}
            </Box>
        </Box>
    )
}
