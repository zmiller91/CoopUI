'use client'

import React from "react"
import Stack from "@mui/material/Stack"
import WaterDropIcon from "@mui/icons-material/WaterDrop"
import GenericAreaPreviewLine from "../generic-area-preview-line"
import { PreviewStat } from "../card-stats"
import { AreaPreviewLineProps } from "../registry"
import { Component } from "../../../client/component"
import { ComponentData, mostRecentPoint } from "../../../client/data"
import ValveStateChip from "../../devices/valve/valve-state-chip"

// Valve ports associated with this area via the port's own `areas` (not the parent component's) -
// undefined if none, so the caller can skip the chip entirely rather than show a false "Off".
function associatedValvePorts(areaId: string, components: Component[]) {
    return components.flatMap((c) =>
        c.type === "VALVE" ? (c.ports ?? []).filter((p) => (p.areas ?? []).some((a) => a.id === areaId)) : []
    )
}

// Averages the current MOISTURE_PERCENT reading across every Moisture Sensor assigned to this area -
// undefined if it has none, so the caller can skip the stat entirely rather than show 0.
function moistureAverage(areaId: string, components: Component[], data: ComponentData[]): number | undefined {
    const sensorIds = new Set(
        components
            .filter((c) => c.type === "MOISTURE" && (c.areas ?? []).some((a) => a.id === areaId))
            .map((c) => c.id)
    )
    if (sensorIds.size === 0) return undefined

    const values = data
        .filter((d) => sensorIds.has(d.componentId))
        .map((d) => mostRecentPoint(d)?.MOISTURE_PERCENT)
        .filter((v): v is number => v !== undefined)

    if (values.length === 0) return undefined
    return values.reduce((sum, v) => sum + v, 0) / values.length
}

export default function GardenBedPreviewLine(props: AreaPreviewLineProps) {
    const moisture = moistureAverage(props.area.id, props.allComponents, props.allData)
    const valvePorts = associatedValvePorts(props.area.id, props.allComponents)

    return (
        <GenericAreaPreviewLine {...props}>
            {(moisture !== undefined || valvePorts.length > 0) && (
                <Stack direction="row" spacing={1} alignItems="center">
                    {moisture !== undefined && (
                        <PreviewStat
                            icon={<WaterDropIcon sx={{ fontSize: 14, color: "var(--primary-700)" }} />}
                            value={`${Math.round(moisture)}`}
                            unit="%"
                            color="primary"
                        />
                    )}
                    {valvePorts.length > 0 && <ValveStateChip on={valvePorts.some((p) => p.state === "ON")} />}
                </Stack>
            )}
        </GenericAreaPreviewLine>
    )
}
