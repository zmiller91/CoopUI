'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Fab from '@mui/material/Fab'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'

import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AddIcon from '@mui/icons-material/Add'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import {usePageTitle} from "../../../../components/app-bar";
import {currentCoop} from "../../coop-context";
import contactClient, {
    AddContactResponse,
    Contact,
    ListContactResponse,
    UpdateContactResponse
} from "../../../../client/contact";
import {AppContent} from "../../../../components/app-content";
import AddActionDialog from "../../../../features/rules/components/add-action-dialog";
import AddContactDialog from "../../../../features/settings/contacts/add-contact-dialog";
import {RuleNotification} from "../../../../client/rule";

function initials(name: string) {
    const s = (name || '').trim()
    if (!s) return '?'
    const parts = s.split(/\s+/)
    const a = parts[0]?.[0] ?? ''
    const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : ''
    return (a + b).toUpperCase()
}

function normalize(s: string) {
    return (s || '').toLowerCase().trim()
}

function primaryLine(c: Contact) {
    // Prefer email, fall back to phone, otherwise show placeholder
    return c.email || c.phone || '—'
}

function channelsLine(c: Contact) {
    const channels: string[] = []
    if (c.email) channels.push('Email')
    if (c.phone) channels.push('Phone')
    if (channels.length === 0) return 'No delivery methods'
    return channels.join(' • ')
}

export default function Contacts() {
    usePageTitle('Contacts')

    const coopId = currentCoop()
    const router = useRouter()

    const [hasLoaded, setHasLoaded] = useState(false)
    const [contacts, setContacts] = useState<Contact[]>([])
    const [query, setQuery] = useState('')

    const [contactDialogOpen, setContactDialogOpen] = useState(false);
    const [editingContactIdx, setEditingContactIdx] = useState<number | undefined>(undefined);
    const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);

    useEffect(() => {
        contactClient.list(coopId, (result: ListContactResponse) => {
            setContacts(result.contacts ?? [])
            setHasLoaded(true)
        })
    }, [coopId])

    const filtered = useMemo(() => {
        const q = normalize(query)
        if (!q) return contacts
        return contacts.filter((c) => {
            const hay = `${c.displayName} ${c.email ?? ''} ${c.phone ?? ''}`.toLowerCase()
            return hay.includes(q)
        })
    }, [contacts, query])


    const onContactDialogClosed = () => {
        requestAnimationFrame(() => {
            document.body.focus()
        })

        setContactDialogOpen(false)
    }

    const onContactUpdated = (contact: Contact) => {
        const callback = (response: AddContactResponse | UpdateContactResponse) => {
            setContacts(prev => {
                if (editingContactIdx == null) return [...prev, response.contact];         // add
                const next = [...prev];
                next[editingContactIdx] = response.contact;                                 // edit
                return next;
            });

            requestAnimationFrame(() => {
                document.body.focus()
            })

            setContactDialogOpen(false);
        }

        if(contact.id) {
            contactClient.update(coopId, {contact}, callback)
        } else {
            contactClient.add(coopId, {contact}, callback)
        }
    }

    function onContactDeleted() {
        contactClient.delete(coopId, editingContact.id, () => {

            setContacts(prev => {
                if (editingContactIdx == null) return [...prev];
                return [
                    ...prev.slice(0, editingContactIdx),
                    ...prev.slice(editingContactIdx + 1),
                ]
            });

            requestAnimationFrame(() => {
                document.body.focus()
            })

            setContactDialogOpen(false);

        });
    }

    function onContactAdd() {
        setEditingContactIdx(null)
        setEditingContact(null)
        setContactDialogOpen(true)
    }

    function onContactClick(contact: Contact, index: number) {
        setEditingContactIdx(index)
        setEditingContact(contact)
        setContactDialogOpen(true)
    }

    return (
        <AppContent hasLoaded={hasLoaded}>
            <Stack spacing={2}>
                {/* Header */}
                <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={2}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                            People associated with your account, used across the app.
                        </Typography>
                    </Box>

                    <Chip label={`${contacts.length} total`} size="small" sx={{ flexShrink: 0 }} />
                </Stack>

                {/* Search */}
                <TextField
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, email, or phone…"
                    size="small"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                        endAdornment: query ? (
                            <InputAdornment position="end">
                                <IconButton aria-label="Clear search" edge="end" size="small" onClick={() => setQuery('')}>
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ) : undefined,
                    }}
                />

                {/* List / Empty State */}
                {filtered.length === 0 ? (
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            textAlign: 'center',
                            bgcolor: 'background.paper',
                        }}
                    >
                        <Stack spacing={1.5} alignItems="center">
                            <Avatar sx={{ width: 56, height: 56 }}>
                                <PeopleOutlineIcon />
                            </Avatar>

                            <Typography variant="subtitle1" fontWeight={700}>
                                {contacts.length === 0 ? 'No contacts yet' : 'No matches'}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
                                {contacts.length === 0
                                    ? 'Create your first contact to use for notifications, communication, and more.'
                                    : 'Try a different search term (name, email, or phone).'}
                            </Typography>

                            {contacts.length === 0 && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={onContactAdd}
                                >
                                    Add contact
                                </Button>
                            )}
                        </Stack>
                    </Paper>
                ) : (
                    <Paper
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                            bgcolor: 'background.paper',
                        }}
                    >
                        <List disablePadding>
                            {filtered.map((c, idx) => (
                                <React.Fragment key={c.id || idx}>
                                    <ListItemButton
                                        onClick={() => onContactClick(c, idx)}
                                        sx={{
                                            py: 1.25,
                                            px: 2,
                                            minHeight: 64,
                                        }}
                                    >
                                        <ListItemAvatar sx={{ minWidth: 48 }}>
                                            <Avatar
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    fontSize: 13,
                                                    fontWeight: 700,
                                                    bgcolor: 'grey.200',
                                                    color: 'text.primary',
                                                }}
                                            >
                                                {initials(c.displayName)}
                                            </Avatar>
                                        </ListItemAvatar>

                                        <ListItemText
                                            primary={c.displayName}
                                            secondary={`${primaryLine(c)} • ${channelsLine(c)}`}
                                            primaryTypographyProps={{
                                                variant: 'body1',
                                                fontWeight: 600,
                                                noWrap: true,
                                            }}
                                            secondaryTypographyProps={{
                                                variant: 'caption',
                                                color: 'text.secondary',
                                                noWrap: true,
                                            }}
                                        />

                                        <ChevronRightIcon fontSize="small" color="action" />
                                    </ListItemButton>

                                    {idx < filtered.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                )}
            </Stack>

            <AddContactDialog open={contactDialogOpen}
                             handleSubmit={onContactUpdated}
                             handleClose={onContactDialogClosed}
                             handleDelete={onContactDeleted}
                             initial={editingContact}/>

            <Tooltip title="Add contact" placement="left" arrow>
                <Fab
                    color="primary"
                    aria-label="Add contact"
                    onClick={onContactAdd}
                    sx={{
                        position: 'fixed',
                        right: 16,
                        bottom: 'calc(56px + env(safe-area-inset-bottom) + 16px)', // bottom nav + safe area + spacing
                        zIndex: (t) => t.zIndex.appBar + 1,
                    }}
                >
                    <AddIcon />
                </Fab>
            </Tooltip>
        </AppContent>
    )
}
