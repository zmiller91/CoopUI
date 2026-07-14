'use client'

import React from "react"
import { Card, CardTitle } from "../card"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"

import CategoryIcon from "@mui/icons-material/Category"

import { Area } from "../../client/area"
import { ComponentData } from "../../client/data"
import { Component } from "../../client/component"

export const AREA_TYPE_META: Record<string, { label: string; icon?: React.ReactNode }> = {
    GARDEN: { label: "Garden" },
    GARDEN_BED: { label: "Garden Bed" },
    CHICKEN_COOP: { label: "Chicken Coop" },
    OTHER: { label: "Other", icon: <CategoryIcon fontSize="small" /> },
}

export interface GroupTileLayoutProps {
    name: string;
    label: string;
    icon: React.ReactNode;
    memberCount: number;
    onClick: () => void;
}

export function GroupTileLayout(props: GroupTileLayoutProps) {
    return (
        <Card onClick={props.onClick}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", minWidth: 0 }}>
                    {props.icon}
                    <CardTitle title={props.name} subtitle={props.label} />
                </Box>
                <Chip
                    label={`${props.memberCount} device${props.memberCount === 1 ? "" : "s"}`}
                    size="small"
                    sx={{ flexShrink: 0 }}
                />
            </Stack>
        </Card>
    )
}

// Canonical registry-conforming shape (matches AreaCardProps in features/areas/registry.tsx) -
// the generic fallback card used for any AreaType without a custom card registered.
export interface GroupCardProps {
    area: Area;
    members: ComponentData[];
    memberComponents: Component[];
    onClick: () => void;
}

export default function GroupCard(props: GroupCardProps) {
    const meta = AREA_TYPE_META[props.area.type]

    return (
        <GroupTileLayout
            name={props.area.name}
            label={meta?.label ?? props.area.type}
            icon={meta ? meta.icon : <CategoryIcon fontSize="small" />}
            memberCount={props.members.length}
            onClick={props.onClick}
        />
    )
}
