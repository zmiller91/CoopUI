'use client'

import React from "react"
import AreaCardShell from "../area-card-shell"
import { computeGroupHealth } from "../device-health"
import { AreaCardProps } from "../registry"
import { ComponentData } from "../../../client/data"
import { mmToInches } from "../units"
import { HeroStat, StatRow } from "../card-stats"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

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

export default function GardenGroupCard(props: AreaCardProps) {
    const health = computeGroupHealth(props.members)

    const forecastMember = props.members.find((d) => d.componentType === "WEATHER_FORECAST")
    const forecastPoint = forecastMember ? mostRecent(forecastMember) : undefined

    const temperature: number | undefined = forecastPoint?.TEMPERATURE
    const transpiration: number | undefined = forecastPoint?.EVAPOTRANSPIRATION
    const rainChance: number | undefined = forecastPoint?.RAIN_PROBABILITY_24H
    const rainAmount: number | undefined = forecastPoint?.RAIN_AMOUNT_24H
    const uvIndex: number | undefined = forecastPoint?.UV_INDEX

    const valveComponents = props.memberComponents.filter((c) => c.type === "VALVE")
    const totalZones = valveComponents.reduce((sum, c) => sum + c.ports.length, 0)
    const zonesOn = valveComponents.reduce(
        (sum, c) => sum + c.ports.filter((p) => p.state === "ON").length,
        0
    )

    const hasHero = temperature !== undefined || transpiration !== undefined
    const hasRain = rainChance !== undefined || rainAmount !== undefined || uvIndex !== undefined
    const hasAnyStat = hasHero || hasRain || totalZones > 0

    return (
        <AreaCardShell
            name={props.area.name}
            label="Garden"
            memberCount={props.members.length}
            health={health}
            onClick={props.onClick}
        >
            <Stack spacing={1.5}>
                {hasHero && (
                    <Stack direction="row" spacing={3} justifyContent="center">
                        {temperature !== undefined && (
                            // Already Fahrenheit - WeatherForecastFetcher requests temperature_unit=fahrenheit
                            // from Open-Meteo directly, unlike the physical WEATHER sensor (Celsius, converted
                            // in ChickenCoopGroupCard).
                            <HeroStat
                                label="Temperature"
                                value={`${Math.round(temperature)}`}
                                unit="°F"
                                color="primary"
                            />
                        )}
                        {transpiration !== undefined && (
                            <HeroStat
                                label="Transpiration"
                                value={`${mmToInches(transpiration)}`}
                                unit="in"
                                color="accent"
                            />
                        )}
                    </Stack>
                )}

                {hasRain && (
                    <Stack spacing={0.5}>
                        {rainChance !== undefined && (
                            <StatRow label="Rain chance" value={`${Math.round(rainChance)}%`} />
                        )}
                        {rainAmount !== undefined && (
                            <StatRow label="Rain amount" value={`${mmToInches(rainAmount)} in`} />
                        )}
                        {uvIndex !== undefined && (
                            <StatRow label="UV index" value={`${Math.round(uvIndex)}`} />
                        )}
                    </Stack>
                )}

                {totalZones > 0 && <StatRow label="Zones watering" value={`${zonesOn} of ${totalZones}`} />}

                {!hasAnyStat && (
                    <Typography variant="body2" color="text.secondary">
                        No devices in this group yet.
                    </Typography>
                )}
            </Stack>
        </AreaCardShell>
    )
}
