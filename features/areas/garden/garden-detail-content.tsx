'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ChartCard from "../../../components/dashboard/chart-card"
import { AREA_TYPE_META } from "../../../components/dashboard/group-card"
import { AreaDetailContentProps } from "../registry"
import { DataDimension } from "../../../utils/chart-config"
import { mmToInches } from "../units"
import areaClient, { ActivityEntry } from "../../../client/area"
import { ActivityLog } from "../activity-log"
import { ComponentData } from "../../../client/data"

const ACTIVITY_LIMIT = 10
const ACTIVITY_WINDOW_MS = 24 * 60 * 60 * 1000

const TEMPERATURE_DIMENSION: DataDimension = {
    key: "TEMPERATURE",
    name: "TEMPERATURE",
    label: "°F",
}

const TRANSPIRATION_DIMENSION: DataDimension = {
    key: "EVAPOTRANSPIRATION",
    name: "EVAPOTRANSPIRATION",
    label: "in",
    formatter: mmToInches,
}

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

export default function GardenDetailContent(props: AreaDetailContentProps) {
    const router = useRouter()

    const [activity, setActivity] = useState<ActivityEntry[]>([])
    const [hasActivityLoaded, setHasActivityLoaded] = useState(false)

    useEffect(() => {
        if (!props.area.id) return
        areaClient.getActivity(props.coopId, props.area.id, (r) => {
            const cutoff = Date.now() - ACTIVITY_WINDOW_MS
            const recent = (r.entries ?? [])
                .filter((e) => e.createdAt >= cutoff)
                .slice(0, ACTIVITY_LIMIT)
            setActivity(recent)
            setHasActivityLoaded(true)
        })
    }, [props.coopId, props.area.id])

    const forecastMember = props.members.find((d) => d.componentType === "WEATHER_FORECAST")
    const forecastPoint = forecastMember ? mostRecent(forecastMember) : undefined

    const environmentParts: string[] = []
    if (forecastPoint?.UV_INDEX !== undefined) {
        environmentParts.push(`UV index ${Math.round(forecastPoint.UV_INDEX)}`)
    }
    if (forecastPoint?.CLOUD_COVER !== undefined) {
        environmentParts.push(`${Math.round(forecastPoint.CLOUD_COVER)}% cloud cover`)
    }
    if (forecastPoint?.RAIN_PROBABILITY_24H !== undefined) {
        environmentParts.push(`${Math.round(forecastPoint.RAIN_PROBABILITY_24H)}% chance of rain`)
    }

    return (
        <Stack spacing={2}>
            {environmentParts.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                    {environmentParts.join(" · ")}
                </Typography>
            )}

            {forecastMember && (
                <ChartCard
                    name={forecastMember.componentName}
                    type={forecastMember.componentTypeDescription}
                    data={forecastMember}
                    dimension1={TEMPERATURE_DIMENSION}
                    dimension2={TRANSPIRATION_DIMENSION}
                    href={`/${props.coopId}/dashboard/${forecastMember.componentId}`}
                />
            )}

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                    Sub-areas
                </Typography>

                {props.childAreas.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No sub-areas yet.
                    </Typography>
                ) : (
                    <List disablePadding>
                        {props.childAreas.map((child) => {
                            const childMeta = AREA_TYPE_META[child.type]
                            return (
                                <ListItem key={child.id} disableGutters disablePadding>
                                    <ListItemButton onClick={() => router.push(`/${props.coopId}/areas/${child.id}`)}>
                                        <ListItemText
                                            primary={child.name}
                                            secondary={childMeta?.label ?? child.type}
                                        />
                                        <ChevronRightIcon fontSize="small" color="action" />
                                    </ListItemButton>
                                </ListItem>
                            )
                        })}
                    </List>
                )}
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                    Activity
                </Typography>

                {hasActivityLoaded && (
                    <ActivityLog entries={activity} memberComponents={props.memberComponents} />
                )}
            </Paper>
        </Stack>
    )
}
