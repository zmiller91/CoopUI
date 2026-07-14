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
import { Card, CardTitle } from "../../../components/card"
import { StatusInfo } from "../../../app/[coopId]/dashboard/status-info"
import { AREA_TYPE_META } from "../../../components/dashboard/group-card"
import { AreaDetailContentProps } from "../registry"
import { CHART_CONFIG } from "../../../utils/chart-config"
import areaClient, { ActivityEntry } from "../../../client/area"
import { ActivityLog } from "../activity-log"
import { ComponentData } from "../../../client/data"
import { cloudCoverLabel, solarRadiationLabel } from "../units"
import Box from "@mui/material/Box"
import ForecastChart from "./forecast-chart"

const ACTIVITY_LIMIT = 10
const ACTIVITY_WINDOW_MS = 24 * 60 * 60 * 1000

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

function ForecastChartCard(props: { coopId: string; data: ComponentData }) {
    const router = useRouter()
    const point = mostRecent(props.data)
    const dimension1 = CHART_CONFIG.WEATHER_FORECAST.dimension1
    const dimension2 = CHART_CONFIG.WEATHER_FORECAST.dimension2

    function lastCheckIn() {
        return Math.round((Date.now() - props.data.lastUpdate) / 1000 / 60)
    }

    return (
        <Card onClick={() => router.push(`/${props.coopId}/dashboard/${props.data.componentId}`)} className="mb-2">
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <CardTitle title={props.data.componentName} subtitle={props.data.componentTypeDescription} />
                <StatusInfo lastCheckin={lastCheckIn()} preview={true} className="justify-self-end" />
            </Box>

            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", pt: 2, pb: 2, pr: 1, pl: 1 }}>
                    {dimension1 && (
                        <Box sx={{ justifySelf: "end", pr: 2.5 }}>
                            <Typography
                                component="span"
                                variant="h3"
                                fontWeight={600}
                                sx={{ letterSpacing: "-0.025em", color: "var(--primary-700)" }}
                            >
                                {point
                                    ? dimension1.formatter
                                        ? dimension1.formatter(point[dimension1.key])
                                        : point[dimension1.key]
                                    : "—"}
                            </Typography>
                            <Typography component="sup" variant="h6" sx={{ ml: 0.5, color: "var(--neutral-500)" }}>
                                {dimension1.label}
                            </Typography>
                        </Box>
                    )}

                    {dimension2 && (
                        <Box sx={{ justifySelf: "end", pr: 2.5 }}>
                            <Typography
                                component="span"
                                variant="h3"
                                fontWeight={600}
                                sx={{ letterSpacing: "-0.025em", color: "var(--accent-700)" }}
                            >
                                {point
                                    ? dimension2.formatter
                                        ? dimension2.formatter(point[dimension2.key])
                                        : point[dimension2.key]
                                    : "—"}
                            </Typography>
                            <Typography component="sup" variant="h6" sx={{ ml: 0.5, color: "var(--neutral-500)" }}>
                                {dimension2.label}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            <Box sx={{ height: 75 }}>
                <ForecastChart data={props.data.data} detailed={false} />
            </Box>
        </Card>
    )
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
    if (forecastPoint?.SOLAR_RADIATION !== undefined) {
        environmentParts.push(`${solarRadiationLabel(forecastPoint.SOLAR_RADIATION)} solar radiation`)
    }
    if (forecastPoint?.CLOUD_COVER !== undefined) {
        environmentParts.push(cloudCoverLabel(forecastPoint.CLOUD_COVER))
    }
    if (forecastPoint?.RAIN_PROBABILITY_24H !== undefined) {
        environmentParts.push(`${Math.round(forecastPoint.RAIN_PROBABILITY_24H)}% chance of rain`)
    }

    return (
        <Stack spacing={2}>
            {environmentParts.length > 0 && (
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        columnGap: 1,
                        rowGap: 0.25,
                    }}
                >
                    {environmentParts.map((part, idx) => (
                        <Typography
                            key={idx}
                            variant="body2"
                            color="text.secondary"
                            sx={{ whiteSpace: "nowrap" }}
                        >
                            {part}
                            {idx < environmentParts.length - 1 ? " ·" : ""}
                        </Typography>
                    ))}
                </Box>
            )}

            {forecastMember && <ForecastChartCard coopId={props.coopId} data={forecastMember} />}

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
