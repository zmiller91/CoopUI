'use client'

import React from "react"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { ActivityEntry } from "../../client/area"
import { Component } from "../../client/component"
import { formatEventTime } from "../../utils/date"

export interface ActivityLogProps {
    entries: ActivityEntry[];
    memberComponents: Component[];   // to resolve componentId+portIndex -> port display name
}

function describeEntry(entry: ActivityEntry): string {
    const isOn = entry.actionKey === "TURN_ON"

    switch (entry.status) {
        case "REQUESTED":
            return `Requested ${isOn ? "on" : "off"} · ${entry.source === "RULE" ? "automation" : "manual"}`
        case "COMPLETE":
            return `Turned ${isOn ? "on" : "off"}`
        case "FAILED":
            return `Failed to turn ${isOn ? "on" : "off"}`
        case "CANCELLED":
            return "Cancelled (superseded by a newer request)"
        default:
            return entry.status
    }
}

function portName(entry: ActivityEntry, memberComponents: Component[]): string {
    const component = memberComponents.find((c) => c.id === entry.componentId)
    const port = component?.ports.find((p) => p.index === entry.portIndex)
    return port?.name || `Zone ${entry.portIndex + 1}`
}

export function ActivityLog(props: ActivityLogProps) {
    if (props.entries.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                No activity yet.
            </Typography>
        )
    }

    return (
        <Stack spacing={1}>
            {props.entries.map((entry, idx) => (
                <Stack key={idx} direction="row" justifyContent="space-between" alignItems="baseline" spacing={2}>
                    <Stack sx={{ minWidth: 0 }}>
                        <Typography variant="body2">{describeEntry(entry)}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {entry.componentName} · {portName(entry, props.memberComponents)}
                        </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                        {formatEventTime(entry.createdAt)}
                    </Typography>
                </Stack>
            ))}
        </Stack>
    )
}
