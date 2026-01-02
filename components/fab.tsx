'use client'

import { ReactNode } from 'react'
import Fab from '@mui/material/Fab'

export interface FloatingActionButtonProps {
    onClick: () => void
    children: ReactNode
}

export default function FloatingActionButton({
                                                 onClick,
                                                 children,
                                             }: FloatingActionButtonProps) {
    return (
        <Fab
            color="primary"
            onClick={onClick}
            sx={{
                position: 'fixed',
                right: 16,
                // 56px bottom nav + 16px spacing (same as your calc)
                bottom: 'calc(56px + 16px)',
                zIndex: (theme) => theme.zIndex.appBar + 1,
            }}
        >
            {children}
        </Fab>
    )
}
