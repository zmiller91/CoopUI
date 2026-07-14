'use client'

import React, { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import areaClient, { Area } from "../../../../client/area"
import componentClient, { Component } from "../../../../client/component"
import data, { ComponentData } from "../../../../client/data"
import { currentCoop } from "../../coop-context"
import { AppContent } from "../../../../components/app-content"
import { usePageTitle } from "../../../../components/app-bar"
import ChartCard from "../../../../components/dashboard/chart-card"
import { AREA_TYPE_META } from "../../../../components/dashboard/group-card"
import { AREA_DETAIL_CONTENT_REGISTRY, AreaDetailContentProps } from "../../../../features/areas/registry"
import { CHART_CONFIG } from "../../../../utils/chart-config"

import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import SectionPaper from "../../../../components/section-paper"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import Button from "@mui/material/Button"
import EditIcon from "@mui/icons-material/Edit"

function currentArea(): string {
    return useParams()["areaId"] as string
}

function GenericAreaDetailContent(props: AreaDetailContentProps) {
    const router = useRouter()

    if (props.members.length === 0) {
        return (
            <SectionPaper sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                    No devices in this group yet.
                </Typography>
                <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => router.push(`/${props.coopId}/areas/${props.area.id}/edit`)}
                >
                    Add Devices
                </Button>
            </SectionPaper>
        )
    }

    return (
        <Grid container spacing={2} sx={{ width: "100%" }}>
            {props.members.map((d: ComponentData) => (
                <Grid key={d.componentId} size={{ xs: 12, md: 6, lg: 4 }}>
                    <ChartCard
                        name={d.componentName}
                        type={d.componentTypeDescription}
                        data={d}
                        dimension1={CHART_CONFIG[d.componentType].dimension1}
                        dimension2={CHART_CONFIG[d.componentType].dimension2}
                        href={`/${props.coopId}/dashboard/${d.componentId}`}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export default function AreaDetail() {
    const coopId = currentCoop()
    const areaId = currentArea()
    const router = useRouter()

    const [areas, setAreas] = useState<Area[]>([])
    const [components, setComponents] = useState<Component[]>([])
    const [coopData, setCoopData] = useState<ComponentData[]>([])
    const [hasAreasLoaded, setHasAreasLoaded] = useState(false)
    const [hasComponentsLoaded, setHasComponentsLoaded] = useState(false)
    const [hasDataLoaded, setHasDataLoaded] = useState(false)
    const hasLoaded = hasAreasLoaded && hasComponentsLoaded && hasDataLoaded

    const area = useMemo(() => areas.find((a) => a.id === areaId), [areas, areaId])
    usePageTitle(area?.name ?? "Group")

    useEffect(() => {
        areaClient.list(coopId, (r) => {
            setAreas(r.areas ?? [])
            setHasAreasLoaded(true)
        })
        componentClient.list(coopId, (r) => {
            setComponents(r ?? [])
            setHasComponentsLoaded(true)
        })
        data.getCoopData(coopId, (r) => {
            setCoopData(r ?? [])
            setHasDataLoaded(true)
        })
    }, [coopId])

    const memberIds = useMemo(() => {
        return new Set(components.filter((c) => (c.areas ?? []).some((a) => a.id === areaId)).map((c) => c.id))
    }, [components, areaId])

    const memberCharts = useMemo(() => {
        return coopData.filter((d) => !!CHART_CONFIG[d.componentType] && memberIds.has(d.componentId))
    }, [coopData, memberIds])

    const memberComponents = useMemo(() => {
        return components.filter((c) => memberIds.has(c.id))
    }, [components, memberIds])

    const childAreas = useMemo(() => {
        return areas.filter((a) => a.parentId === areaId)
    }, [areas, areaId])

    const DetailContent = area ? AREA_DETAIL_CONTENT_REGISTRY[area.type] ?? GenericAreaDetailContent : undefined
    const typeMeta = area ? AREA_TYPE_META[area.type] : undefined

    return (
        <AppContent hasLoaded={hasLoaded}>
            {hasLoaded && !area ? (
                <SectionPaper sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                        Group not found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        This group may have been deleted.
                    </Typography>
                </SectionPaper>
            ) : (
                <Stack spacing={2}>
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="h6" fontWeight={700} noWrap>
                                {area?.name}
                            </Typography>
                            {typeMeta && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                                    {typeMeta.label}
                                </Typography>
                            )}
                        </Box>

                        <Tooltip title="Edit group" arrow>
                            <IconButton
                                aria-label="Edit group"
                                onClick={() => router.push(`/${coopId}/areas/${areaId}/edit`)}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>

                    {area && DetailContent && (
                        <DetailContent
                            coopId={coopId}
                            area={area}
                            members={memberCharts}
                            memberComponents={memberComponents}
                            childAreas={childAreas}
                            allComponents={components}
                            allData={coopData}
                        />
                    )}
                </Stack>
            )}
        </AppContent>
    )
}
