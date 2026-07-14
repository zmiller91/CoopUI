'use client'

import React from "react"
import GenericAreaPreviewLine from "../generic-area-preview-line"
import { PreviewStat } from "../card-stats"
import { AreaPreviewLineProps } from "../registry"
import { Component } from "../../../client/component"
import { ComponentData } from "../../../client/data"

function mostRecent(d: ComponentData): Record<string, any> | undefined {
    let idx = -1
    let result: Record<string, any> | undefined
    for (const point of d.data ?? []) {
        if (point.idx > idx) {
            idx = point.idx
            result = point
        }
    }
    return result
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
        .map((d) => mostRecent(d)?.MOISTURE_PERCENT)
        .filter((v): v is number => v !== undefined)

    if (values.length === 0) return undefined
    return values.reduce((sum, v) => sum + v, 0) / values.length
}

export default function GardenBedPreviewLine(props: AreaPreviewLineProps) {
    const moisture = moistureAverage(props.area.id, props.allComponents, props.allData)

    return (
        <GenericAreaPreviewLine {...props}>
            {moisture !== undefined && (
                <PreviewStat value={`${Math.round(moisture)}`} unit="% moisture" color="primary" />
            )}
        </GenericAreaPreviewLine>
    )
}
