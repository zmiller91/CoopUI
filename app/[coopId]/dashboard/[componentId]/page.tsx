'use client'

import React, { useEffect, useMemo, useState } from 'react'
import data, { ComponentData, MetricInterval } from '../../../../client/data'
import { currentCoop } from '../../coop-context'
import { currentComponent } from './component-context'
import { CHART_CONFIG } from '../../../../utils/chart-config'
import { AppContent } from '../../../../components/app-content'
import { StatusInfo } from '../status-info'
import Chart from '../chart'
import { COMPONENT_DETAIL_REGISTRY, ComponentDetailContentProps } from '../../../../features/components/registry'
import MetricTiles, { getMostRecentPoint, formatValue } from '../../../../features/components/metric-tiles'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import CircularProgress from '@mui/material/CircularProgress'

// Fallback for any componentType without a COMPONENT_DETAIL_REGISTRY entry - chartConfig-driven
// tiles + the generic sparkline-style Chart, same behavior every type had before per-type detail
// content existed.
function GenericComponentDetail(props: ComponentDetailContentProps) {
    const chartConfig = props.componentData?.componentType ? CHART_CONFIG[props.componentData.componentType] : undefined
    const mostRecent = getMostRecentPoint(props.componentData?.data ?? [])

    const convertedData = useMemo(() => {
        const points = props.componentData?.data ?? []
        if (!chartConfig || points.length === 0) return points

        return points.map((p: any) => {
            const copy = { ...p }
            if (chartConfig.dimension1) {
                copy[chartConfig.dimension1.key] = formatValue(chartConfig.dimension1, copy[chartConfig.dimension1.key])
            }
            if (chartConfig.dimension2) {
                copy[chartConfig.dimension2.key] = formatValue(chartConfig.dimension2, copy[chartConfig.dimension2.key])
            }
            return copy
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.componentData?.data, chartConfig])

    return (
        <Stack spacing={2}>
            <MetricTiles chartConfig={chartConfig} mostRecent={mostRecent} />

            <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2, pt: 1 }}>
                    <Tabs
                        value={props.interval}
                        onChange={(_, v) => props.onIntervalChange(v)}
                        variant="fullWidth"
                        indicatorColor="secondary"
                        textColor="inherit"
                    >
                        <Tab value={MetricInterval.DAY} label="Day" />
                        <Tab value={MetricInterval.WEEK} label="Week" />
                        <Tab value={MetricInterval.MONTH} label="Month" />
                        <Tab value={MetricInterval.YEAR} label="Year" />
                    </Tabs>
                </Box>

                <Divider />

                <Box sx={{ p: 2, height: 280, position: 'relative' }}>
                    {props.loading && (
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'grid',
                                placeItems: 'center',
                                bgcolor: 'rgba(255,255,255,0.6)',
                                zIndex: 1,
                            }}
                        >
                            <CircularProgress size={28} />
                        </Box>
                    )}

                    <Chart
                        detailed={true}
                        data={convertedData}
                        dataKey={chartConfig?.dimension1?.key}
                        dataKey2={chartConfig?.dimension2?.key}
                    />
                </Box>
            </Paper>
        </Stack>
    )
}

export default function ComponentDashboard() {
    const coopId = currentCoop()
    const componentId = currentComponent()

    const [componentData, setComponentData] = useState<ComponentData>({} as ComponentData)
    const [interval, setInterval] = useState<MetricInterval>(MetricInterval.DAY)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        data.getComponentData(coopId, componentId, MetricInterval.DAY, (d: ComponentData) => {
            setComponentData(d)
            setInterval(MetricInterval.DAY)
            setLoading(false)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coopId, componentId])

    const lastCheckinMin = useMemo(() => {
        const lastUpdate = componentData?.lastUpdate
        if (!lastUpdate) return 0
        return Math.max(0, Math.round((Date.now() - lastUpdate) / 1000 / 60))
    }, [componentData?.lastUpdate])

    function switchInterval(newInterval: MetricInterval) {
        setLoading(true)
        setInterval(newInterval)
        data.getComponentData(coopId, componentId, newInterval, (d: ComponentData) => {
            setComponentData(d)
            setLoading(false)
        })
    }

    const DetailContent = componentData?.componentType
        ? COMPONENT_DETAIL_REGISTRY[componentData.componentType] ?? GenericComponentDetail
        : GenericComponentDetail

    return (
        <AppContent>
            <Stack spacing={2}>
                {/* Header (optional, but makes it feel like a real detail page) */}
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h6" fontWeight={700} noWrap>
                        {componentData?.componentName ?? 'Component'}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }} alignItems="center">
                        <Typography variant="body2" color="text.secondary" noWrap>
                            {componentData?.componentTypeDescription ?? '—'}
                        </Typography>
                    </Stack>
                </Box>

                {/* Status */}
                <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                    <StatusInfo lastCheckin={lastCheckinMin} />
                </Paper>

                <DetailContent
                    componentData={componentData}
                    interval={interval}
                    loading={loading}
                    onIntervalChange={switchInterval}
                />
            </Stack>
        </AppContent>
    )
}
