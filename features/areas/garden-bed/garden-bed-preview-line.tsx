'use client'

import React from "react"
import WaterDropIcon from "@mui/icons-material/WaterDrop"
import GenericAreaPreviewLine from "../generic-area-preview-line"
import { PreviewStat } from "../card-stats"
import { AreaPreviewLineProps } from "../registry"
import { Component } from "../../../client/component"
import { ComponentData, mostRecentPoint } from "../../../client/data"

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

    return (
        <GenericAreaPreviewLine {...props}>
            {moisture !== undefined && (
                <PreviewStat
                    icon={<WaterDropIcon fontSize="small" sx={{ color: "var(--primary-700)" }} />}
                    value={`${Math.round(moisture)}`}
                    unit="%"
                    color="primary"
                />
            )}
        </GenericAreaPreviewLine>
    )
}
