'use client'


import React, { ReactNode } from 'react'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'


export interface CardTitleProps {
    title: string
    subtitle: string
}

export function CardTitle({ title, subtitle }: CardTitleProps) {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography
                variant="subtitle1"
                fontWeight={600}
                color="text.primary"
            >
                {title}
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
            >
                {subtitle}
            </Typography>
        </Box>
    )
}


export interface CardProps {
    children: ReactNode
    onClick?: () => void
    className?: string
}

export function Card({ children, onClick, className }: CardProps) {
    const content = (
        <CardContent sx={{ p: 2 }}>
            {children}
        </CardContent>
    )

    return (
        <MuiCard
            variant="outlined"
            className={className}
            sx={{
                borderRadius: 2,
                transition: 'box-shadow 150ms ease, border-color 150ms ease',
                '&:hover': {
                    boxShadow: 1,
                    borderColor: 'divider',
                },
            }}
        >
            {onClick ? (
                <CardActionArea onClick={onClick}>
                    {content}
                </CardActionArea>
            ) : (
                content
            )}
        </MuiCard>
    )
}