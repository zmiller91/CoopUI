'use client'

import { ReactNode } from 'react'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'

export interface FloatingActionButtonProps {
    label: string
    onClick: () => void
    children: ReactNode
}

export default function FloatingActionButton({
                                                 label,
                                                 onClick,
                                                 children,
                                             }: FloatingActionButtonProps) {
    return (
        <Tooltip title={label} placement="left" arrow>
            <Fab
                color="primary"
                aria-label={label}
                onClick={onClick}
                sx={{
                    position: 'fixed',
                    right: 16,
                    bottom: 'calc(56px + env(safe-area-inset-bottom) + 16px)',
                    zIndex: (theme) => theme.zIndex.appBar + 1,
                }}
            >
                {children}
            </Fab>
        </Tooltip>
    )
}
