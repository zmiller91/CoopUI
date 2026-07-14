'use client'

import { ReactNode } from 'react'
import Paper from '@mui/material/Paper'
import { SxProps, Theme } from '@mui/material/styles'

export interface SectionPaperProps {
    children: ReactNode
    sx?: SxProps<Theme>
}

export default function SectionPaper({ children, sx }: SectionPaperProps) {
    return (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, ...sx }}>
            {children}
        </Paper>
    )
}
