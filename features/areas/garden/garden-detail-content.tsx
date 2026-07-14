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
import { CHART_CONFIG } from "../../../utils/chart-config"
import areaClient, { ActivityEntry } from "../../../client/area"
import { ActivityLog } from "../activity-log"

export default function GardenDetailContent(props: AreaDetailContentProps) {
    const router = useRouter()

    const [activity, setActivity] = useState<ActivityEntry[]>([])
    const [hasActivityLoaded, setHasActivityLoaded] = useState(false)

    useEffect(() => {
        if (!props.area.id) return
        areaClient.getActivity(props.coopId, props.area.id, (r) => {
            setActivity(r.entries ?? [])
            setHasActivityLoaded(true)
        })
    }, [props.coopId, props.area.id])

    const forecastMember = props.members.find((d) => d.componentType === "WEATHER_FORECAST")

    return (
        <Stack spacing={2}>
            {forecastMember && (
                <ChartCard
                    name={forecastMember.componentName}
                    type={forecastMember.componentTypeDescription}
                    data={forecastMember}
                    dimension1={CHART_CONFIG.WEATHER_FORECAST.dimension1}
                    dimension2={CHART_CONFIG.WEATHER_FORECAST.dimension2}
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
