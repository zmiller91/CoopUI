'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
    Box,
    Container,
    Typography,
    Card,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import {currentCoop} from "../coop-context";

export default function SettingsPage() {
    const router = useRouter()
    const coop = currentCoop();

    return (
        <Container maxWidth="sm" sx={{ pt: 2, pb: 10 }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={700}>
                    Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage settings and app configuration.
                </Typography>
            </Box>

            <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <List disablePadding>
                    <ListItemButton onClick={() => router.push(`/${coop}/settings/contacts`)}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <PeopleOutlineIcon />
                        </ListItemIcon>

                        <ListItemText
                            primary="Contacts"
                            secondary="People associated with your account, used for communication, notifications, and more."
                        />

                        <ChevronRightIcon />
                    </ListItemButton>

                    <Divider />
                    {/* Future items go here */}
                    {/*
                      <ListItemButton onClick={() => router.push('/notifications')}>
                        ...
                      </ListItemButton>
                      */}
                </List>
            </Card>
        </Container>
    )
}