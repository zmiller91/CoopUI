'use client'

import React from "react"
import AreaCardShell from "../area-card-shell"
import { computeGroupHealth } from "../device-health"
import { AreaCardProps } from "../registry"
import { ComponentData, mostRecentPoint } from "../../../client/data"
import { mmToInches } from "../../../utils/units"
import { solarRadiationLabel } from "../../components/weather-forecast/units"
import { HeroStat, StatRow } from "../card-stats"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

export default function GardenGroupCard(props: AreaCardProps) {
    const health = computeGroupHealth(props.members)

    const forecastMember = props.members.find((d) => d.componentType === "WEATHER_FORECAST")
    const forecastPoint = forecastMember ? mostRecentPoint(forecastMember) : undefined

    const temperature: number | undefined = forecastPoint?.TEMPERATURE
    const transpiration: number | undefined = forecastPoint?.EVAPOTRANSPIRATION
    const rainChance: number | undefined = forecastPoint?.RAIN_PROBABILITY_24H
    const rainForecast: number | undefined = forecastPoint?.RAIN_AMOUNT_24H
    const rainActual: number | undefined = forecastPoint?.RAIN_ACTUAL_24H
    const solarRadiation: number | undefined = forecastPoint?.SOLAR_RADIATION

    const valveComponents = props.memberComponents.filter((c) => c.type === "VALVE")
    const totalZones = valveComponents.reduce((sum, c) => sum + c.ports.length, 0)
    const zonesOn = valveComponents.reduce(
        (sum, c) => sum + c.ports.filter((p) => p.state === "ON").length,
        0
    )

    const hasHero = temperature !== undefined || transpiration !== undefined
    const hasStats =
        rainChance !== undefined ||
        rainForecast !== undefined ||
        rainActual !== undefined ||
        solarRadiation !== undefined ||
        totalZones > 0
    const hasAnyStat = hasHero || hasStats

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
                            // Raw hourly ET0 rate (mm/hr) - values are small enough (typically well under
                            // 1mm/hr) that converting to inches rounds almost everything down to 0.0-0.03,
                            // losing the resolution that makes "high vs low" readable at a glance.
                            <HeroStat
                                label="Transpiration"
                                value={`${Math.round(transpiration * 100) / 100}`}
                                unit="mm/hr"
                                color="accent"
                            />
                        )}
                    </Stack>
                )}

                {hasStats && (
                    <Stack spacing={0.5}>
                        {rainActual !== undefined && (
                            <StatRow label="Rain (last 24h)" value={`${mmToInches(rainActual)} in`} />
                        )}
                        {rainChance !== undefined && (
                            <StatRow label="Rain chance" value={`${Math.round(rainChance)}%`} />
                        )}
                        {rainForecast !== undefined && (
                            <StatRow label="Rain forecast" value={`${mmToInches(rainForecast)} in`} />
                        )}
                        {solarRadiation !== undefined && (
                            <StatRow label="Solar radiation" value={solarRadiationLabel(solarRadiation)} />
                        )}
                        {totalZones > 0 && (
                            <StatRow label="Zones watering" value={`${zonesOn} of ${totalZones}`} />
                        )}
                    </Stack>
                )}

                {!hasAnyStat && (
                    <Typography variant="body2" color="text.secondary">
                        No devices in this group yet.
                    </Typography>
                )}
            </Stack>
        </AreaCardShell>
    )
}
