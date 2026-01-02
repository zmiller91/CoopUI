'use client'

import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

export interface SnackBarProps {
    message: string
    display: boolean
    callback: (displayed: boolean) => void
}

export default function SnackBar({ message, display, callback }: SnackBarProps) {
    return (
        <Snackbar
            open={display}
            autoHideDuration={5000}
            onClose={() => callback(false)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            sx={{
                // Lift above bottom nav + safe area
                bottom: 'calc(56px + env(safe-area-inset-bottom) + 8px)',
            }}
        >
            <Alert
                severity="info"
                elevation={6}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}
