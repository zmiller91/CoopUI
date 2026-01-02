'use client'

import componentClient from "../../../client/component"
import React, { useEffect, useMemo, useState } from "react"
import { currentCoop } from "../coop-context"
import { useRouter } from "next/navigation"
import { AppContent } from "../../../components/app-content"
import { usePageTitle } from "../../../components/app-bar"

import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"
import ListItemText from "@mui/material/ListItemText"
import Divider from "@mui/material/Divider"
import Fab from "@mui/material/Fab"
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"

import SearchIcon from "@mui/icons-material/Search"
import ClearIcon from "@mui/icons-material/Clear"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import AddIcon from "@mui/icons-material/Add"
import SensorsIcon from "@mui/icons-material/Sensors"

type ComponentDto = {
    id: string
    name: string
    serial: string
    // Optional if you have it; used only for nicer display if present
    type?: string
}

function initials(name: string) {
    const s = (name || "").trim()
    if (!s) return "?"
    const parts = s.split(/\s+/)
    const a = parts[0]?.[0] ?? ""
    const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : ""
    return (a + b).toUpperCase()
}

function normalize(s: string) {
    return (s || "").toLowerCase().trim()
}

export default function Components() {
    usePageTitle("Components")

    const coopId = currentCoop()
    const router = useRouter()

    const [hasLoaded, setHasLoaded] = useState(false)
    const [components, setComponents] = useState<ComponentDto[]>([])
    const [query, setQuery] = useState("")

    useEffect(() => {
        componentClient.list(coopId, (result: ComponentDto[]) => {
            setComponents(result ?? [])
            setHasLoaded(true)
        })
    }, [coopId])

    const filtered = useMemo(() => {
        const q = normalize(query)
        if (!q) return components
        return components.filter((c) => {
            const hay = `${c.name} ${c.serial} ${c.type ?? ""}`.toLowerCase()
            return hay.includes(q)
        })
    }, [components, query])

    const registerPath = `/${coopId}/components/register`
    const editPath = (id: string) => `/${coopId}/components/${id}`

    return (
        <AppContent hasLoaded={hasLoaded}>
            <Stack spacing={2}>
                {/* Header */}
                <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={2}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h6" fontWeight={700} noWrap>
                            Components
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                            Registered devices in this coop
                        </Typography>
                    </Box>

                    <Chip
                        label={`${components.length} total`}
                        size="small"
                        sx={{ flexShrink: 0 }}
                    />
                </Stack>

                {/* Search */}
                <TextField
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, serial, or type…"
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
                                <IconButton
                                    aria-label="Clear search"
                                    edge="end"
                                    size="small"
                                    onClick={() => setQuery("")}
                                >
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
                            textAlign: "center",
                            bgcolor: "background.paper",
                        }}
                    >
                        <Stack spacing={1.5} alignItems="center">
                            <Avatar sx={{ width: 56, height: 56 }}>
                                <SensorsIcon />
                            </Avatar>

                            <Typography variant="subtitle1" fontWeight={700}>
                                {components.length === 0 ? "No components yet" : "No matches"}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
                                {components.length === 0
                                    ? "Register your first device to start collecting data and automations."
                                    : "Try a different search term (name, serial, or type)."}
                            </Typography>

                            {components.length === 0 && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={() => router.push(registerPath)}
                                >
                                    Register component
                                </Button>
                            )}
                        </Stack>
                    </Paper>
                ) : (
                    <Paper
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            overflow: "hidden",
                            bgcolor: "background.paper",
                        }}
                    >
                        <List disablePadding>
                            {filtered.map((c, idx) => (
                                <React.Fragment key={c.id}>
                                    <ListItemButton
                                        onClick={() => router.push(editPath(c.id))}
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
                                                    bgcolor: "grey.200",
                                                    color: "text.primary",
                                                }}
                                            >
                                                {initials(c.name)}
                                            </Avatar>
                                        </ListItemAvatar>

                                        <ListItemText
                                            primary={c.name}
                                            secondary={
                                                c.type ? `${c.serial} • ${c.type}` : c.serial
                                            }
                                            primaryTypographyProps={{
                                                variant: "body1",
                                                fontWeight: 600,
                                                noWrap: true,
                                            }}
                                            secondaryTypographyProps={{
                                                variant: "caption",
                                                color: "text.secondary",
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

            {/* FAB */}
            <Tooltip title="Register component" placement="left" arrow>
                <Fab
                    color="primary"
                    aria-label="Register component"
                    onClick={() => router.push(registerPath)}
                    sx={{
                        position: "fixed",
                        right: 16,
                        bottom: "calc(56px + env(safe-area-inset-bottom) + 16px)", // bottom nav + safe area + spacing
                        zIndex: (t) => t.zIndex.appBar + 1,
                    }}
                >
                    <AddIcon />
                </Fab>
            </Tooltip>
        </AppContent>
    )
}
