'use client'

import React, { useEffect, useMemo, useState } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import SectionPaper from "../../../components/section-paper"
import SelectInput, { SelectOption } from "../../../components/form/select"
import { AreaEditSectionProps } from "../registry"

export function portKey(componentId: string, portIndex: number): string {
    return `${componentId}:${portIndex}`
}

export function parsePortKey(key: string): { componentId: string; portIndex: number } {
    const [componentId, indexStr] = key.split(":")
    return { componentId, portIndex: Number(indexStr) }
}

export default function GardenBedIrrigationSection(props: AreaEditSectionProps) {
    const [selectedPortKeys, setSelectedPortKeys] = useState<string[]>([])
    const [portPickerValue, setPortPickerValue] = useState("")

    // This area plus every ancestor up the parent chain - a valve counts as "available" for port
    // association if it's assigned (as a whole device) to any area in this chain, not just this one.
    const ancestorIds = useMemo(() => {
        const areasById = new Map(props.areas.map((a) => [a.id, a]))
        const ids: string[] = []
        let current: typeof props.area | undefined = props.area
        while (current) {
            if (current.id) ids.push(current.id)
            current = current.parentId ? areasById.get(current.parentId) : undefined
        }
        return ids
    }, [props.area, props.areas])

    const availableValves = useMemo(() => {
        return props.components.filter(
            (c) => c.type === "VALVE" && (c.areas ?? []).some((a) => ancestorIds.includes(a.id as string))
        )
    }, [props.components, ancestorIds])

    // Derives the currently-persisted selection from the freshly loaded data and reports it up as the
    // section's initial state - onPortKeysChange doubles as both "notify of a change" and "here's what's
    // already saved," so the edit page can capture the latter as its diff baseline.
    useEffect(() => {
        const currentPortKeys = availableValves.flatMap((v) =>
            (v.ports ?? [])
                .filter((p) => (p.areas ?? []).some((a) => a.id === props.area.id))
                .map((p) => portKey(v.id, p.index))
        )
        setSelectedPortKeys(currentPortKeys)
        props.onPortKeysChange(currentPortKeys)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableValves, props.area.id])

    const portPickerOptions = useMemo<SelectOption[]>(() => {
        return availableValves.flatMap((v) =>
            (v.ports ?? [])
                .filter((p) => !selectedPortKeys.includes(portKey(v.id, p.index)))
                .map((p) => ({ label: `${v.name} — ${p.name}`, value: portKey(v.id, p.index) }))
        )
    }, [availableValves, selectedPortKeys])

    const selectedPorts = useMemo(() => {
        return selectedPortKeys.map((key) => {
            const { componentId, portIndex } = parsePortKey(key)
            const valve = availableValves.find((v) => v.id === componentId)
            const port = valve?.ports.find((p) => p.index === portIndex)
            return { key, valveName: valve?.name ?? "Unknown device", portName: port?.name ?? `Zone ${portIndex + 1}` }
        })
    }, [selectedPortKeys, availableValves])

    function onPortPick(value: string) {
        if (!value) return
        const next = [...selectedPortKeys, value]
        setSelectedPortKeys(next)
        props.onPortKeysChange(next)
        setPortPickerValue("")
    }

    function removePort(key: string) {
        const next = selectedPortKeys.filter((k) => k !== key)
        setSelectedPortKeys(next)
        props.onPortKeysChange(next)
    }

    if (availableValves.length === 0) return null

    return (
        <SectionPaper>
            <Typography variant="subtitle1" fontWeight={700}>
                Irrigation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Associate this garden bed with a zone on one of its irrigation controllers.
            </Typography>

            <SelectInput
                id="add-port"
                title="Add a zone"
                placeholder="Select a zone..."
                value={portPickerValue}
                onChange={onPortPick}
                options={portPickerOptions}
            />

            <Box sx={{ mt: 1.5 }}>
                {selectedPorts.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No zones associated yet.
                    </Typography>
                ) : (
                    <List disablePadding>
                        {selectedPorts.map((p) => (
                            <ListItem
                                key={p.key}
                                disableGutters
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="Remove"
                                        onClick={() => removePort(p.key)}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                }
                            >
                                <ListItemText primary={p.portName} secondary={p.valveName} />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        </SectionPaper>
    )
}
