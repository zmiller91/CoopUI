'use client'

import React from "react"
import { Card, CardTitle } from "../../components/card"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"
import { GroupHealth } from "./device-health"

export interface AreaCardShellProps {
    name: string;
    label: string;
    icon?: React.ReactNode;
    memberCount: number;
    health: GroupHealth;
    onClick: () => void;
    children?: React.ReactNode;
}

export default function AreaCardShell(props: AreaCardShellProps) {
    const needsAttention = props.health.stale + props.health.offline

    return (
        <Card onClick={props.onClick}>
            <Stack spacing={1.5}>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", minWidth: 0 }}>
                        {props.icon}
                        <CardTitle title={props.name} subtitle={props.label} />
                    </Box>
                    <Stack alignItems="flex-end" spacing={0.5} sx={{ flexShrink: 0 }}>
                        <Chip
                            label={`${props.memberCount} device${props.memberCount === 1 ? "" : "s"}`}
                            size="small"
                        />
                        {needsAttention > 0 && (
                            <Chip
                                label={`${needsAttention} sensor${needsAttention === 1 ? "" : "s"} need attention`}
                                size="small"
                                sx={
                                    props.health.offline > 0
                                        ? { bgcolor: "var(--error-100)", color: "var(--error-600)" }
                                        : { bgcolor: "var(--warn-100)", color: "var(--warn-600)" }
                                }
                            />
                        )}
                    </Stack>
                </Stack>

                {props.children}
            </Stack>
        </Card>
    )
}
