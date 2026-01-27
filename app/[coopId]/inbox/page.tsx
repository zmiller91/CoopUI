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
import Avatar from '@mui/material/Avatar'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'

import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import inboxClient, {InboxMessage, ListInboxResponse} from "../../../client/inbox";
import {usePageTitle} from "../../../components/app-bar";
import {currentCoop} from "../coop-context";
import {AppContent} from "../../../components/app-content";
import {MailOutline} from "@mui/icons-material";
import InboxMessageDialog from "../../../features/inbox/inbox-message-dialog";
import { formatRelativeDate } from "../../../utils/date"
import {Badge} from "@mui/material";
import {useInbox} from "../../../components/InboxContext";


function subject(m: InboxMessage) {
    return m.subject || "No subject"
}

function preview(m: InboxMessage) {
    const s = (m.bodyText || '').replace(/\s+/g, ' ').trim()
    if (!s) return '—'
    return s.length > 120 ? s.slice(0, 117) + '…' : s
}

function normalize(str?: string) {
    return (str || '').trim().toLowerCase()
}

export default function Contacts() {
    usePageTitle('Inbox')

    const coopId = currentCoop()
    const inbox = useInbox();
    const router = useRouter()

    const [hasMessagesLoaded, setHasMessagesLoaded] = useState(false);
    const [hasNewCountLoaded, setHasNewCountLoaded] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false)

    const [messages, setMessages] = useState<InboxMessage[]>([])
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(0);

    const [messageDialogOpen, setMessageDialogOpen] = useState(false);
    const [viewingMessageIdx, setViewingMessageIdx] = useState<number | undefined>(undefined);
    const [viewingMessage, setViewingMessage] = useState<InboxMessage | undefined>(undefined);

    useEffect(() => {
        setHasLoaded(hasMessagesLoaded && hasNewCountLoaded)
    }, [hasMessagesLoaded, hasNewCountLoaded])

    useEffect(() => {
        inboxClient.list(coopId, page, (result: ListInboxResponse) => {
            setMessages(result.messages ?? [])
            setHasMessagesLoaded(true)
        })

        inboxClient.countNew(coopId, (count: number) => {
            inbox.setInboxNewCount(count);
            setHasNewCountLoaded(true);
        })

    }, [coopId, page])

    const filtered = useMemo(() => {
        const q = normalize(query)
        if (!q) return messages
        return messages.filter((m) => {
            const hay = normalize(m.subject + " " + m.bodyText)
            return hay.includes(q)
        })
    }, [messages, query])


    const onMessageDialogClosed = () => {
        requestAnimationFrame(() => {
            document.body.focus()
        })

        setMessageDialogOpen(false)
    }

    function onMessageDeleted() {
        inboxClient.delete(coopId, viewingMessage.id, () => {

            setMessages(prev => {
                if (viewingMessageIdx == null) return [...prev];
                return [
                    ...prev.slice(0, viewingMessageIdx),
                    ...prev.slice(viewingMessageIdx + 1),
                ]
            });

            requestAnimationFrame(() => {
                document.body.focus()
            })

            setMessageDialogOpen(false);

        });
    }

    function onMessageClick(message: InboxMessage, index: number) {
        setViewingMessageIdx(index)
        setViewingMessage(message)
        setMessageDialogOpen(true)

        if (message.readTs == null) {
            const now = new Date().toISOString()

            setMessages(prev =>
                prev.map(m =>
                    m.id === message.id
                        ? { ...m, readTs: now }
                        : m
                )
            )

            inbox.decrementInboxNewCount();
            inboxClient.markRead(coopId, message.id, () => {})
        }
    }

    return (
        <AppContent hasLoaded={hasLoaded}>
            <Stack spacing={2}>
                {/* Header */}
                <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={2}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                            System notification and alerts
                        </Typography>
                    </Box>

                    <Chip label={`${inbox.inboxNewCount} new`} size="small" sx={{ flexShrink: 0 }} />
                </Stack>

                {/* Search */}
                <TextField
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by subject or message body..."
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
                                <MailOutline />
                            </Avatar>

                            <Typography variant="subtitle1" fontWeight={700}>
                                {messages.length === 0 ? 'No messages' : 'No matches'}
                            </Typography>
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
                            {filtered.map((m, idx) => (
                                <React.Fragment key={m.id || idx}>
                                    <ListItemButton
                                        onClick={() => onMessageClick(m, idx)}
                                        sx={{
                                            py: 1.25,
                                            px: 2,
                                            minHeight: 64,
                                        }}
                                    >
                                        {/* Unread dot */}
                                        <Badge
                                            variant="dot"
                                            color="primary"
                                            invisible={m.readTs != null}
                                            sx={{
                                                mr: 1.5,
                                                '& .MuiBadge-badge': {
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                },
                                            }}
                                        >
                                            {/* anchor */}
                                            <Box sx={{ width: 8 }} />
                                        </Badge>

                                        <ListItemText
                                            primary={subject(m)}
                                            secondary={preview(m)}
                                            primaryTypographyProps={{
                                                fontWeight: m.readTs == null ? 700 : 600,
                                                noWrap: true,
                                            }}
                                            secondaryTypographyProps={{
                                                color: m.readTs == null ? 'text.secondary' : 'text.disabled',
                                                noWrap: true,
                                            }}
                                        />

                                        <Box sx={{ ml: 2, textAlign: 'right', flexShrink: 0 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatRelativeDate(m.createdTs)}
                                            </Typography>
                                            <ChevronRightIcon fontSize="small" color="action" />
                                        </Box>
                                    </ListItemButton>

                                    {idx < filtered.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                )}
            </Stack>

            <InboxMessageDialog open={messageDialogOpen}
                              handleClose={onMessageDialogClosed}
                              handleDelete={onMessageDeleted}
                              message={viewingMessage}/>
        </AppContent>
    )
}
