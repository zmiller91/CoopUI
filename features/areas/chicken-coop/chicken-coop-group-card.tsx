'use client'

import React from "react"
import AreaCardShell from "../area-card-shell"
import { computeGroupHealth } from "../device-health"
import { AreaCardProps } from "../registry"
import { ComponentData, mostRecentPoint } from "../../../client/data"
import { celsiusToFahrenheit, gramsToLbs } from "../../../utils/units"
import { HeroStat, StatRow } from "../card-stats"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

export default function ChickenCoopGroupCard(props: AreaCardProps) {
    const health = computeGroupHealth(props.members)

    const weatherMember = props.members.find((d) => d.componentType === "WEATHER")
    const weatherPoint = weatherMember ? mostRecentPoint(weatherMember) : undefined
    const temperature: number | undefined = weatherPoint?.TEMPERATURE
    const humidity: number | undefined = weatherPoint?.HUMIDITY

    const scaleMember = props.members.find((d) => d.componentType === "SCALE")
    const scalePoint = scaleMember ? mostRecentPoint(scaleMember) : undefined
    const weight: number | undefined = scalePoint?.WEIGHT

    const hasAnyStat = temperature !== undefined || humidity !== undefined || weight !== undefined

    return (
        <AreaCardShell
            name={props.area.name}
            label="Chicken Coop"
            memberCount={props.members.length}
            health={health}
            onClick={props.onClick}
        >
            <Stack spacing={1.5}>
                {weight !== undefined && (
                    <Stack direction="row" justifyContent="center">
                        <HeroStat label="Feed remaining" value={`${gramsToLbs(weight)}`} unit="lbs" color="primary" />
                    </Stack>
                )}

                <Stack spacing={0.5}>
                    {temperature !== undefined && (
                        <StatRow label="Temperature" value={`${celsiusToFahrenheit(temperature)}°F`} />
                    )}
                    {humidity !== undefined && <StatRow label="Humidity" value={`${humidity}%RH`} />}
                </Stack>

                {!hasAnyStat && (
                    <Typography variant="body2" color="text.secondary">
                        No devices in this group yet.
                    </Typography>
                )}
            </Stack>
        </AreaCardShell>
    )
}
