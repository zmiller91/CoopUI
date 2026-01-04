'use client'

import React, { useEffect, useMemo, useState } from 'react'
import data, { ComponentData, MetricInterval } from '../../../../client/data'
import { currentCoop } from '../../coop-context'
import { currentComponent } from './component-context'
import { CHART_CONFIG, DataDimension } from '../../../../utils/chart-config'
import { AppContent } from '../../../../components/app-content'
import { StatusInfo } from '../status-info'
import Chart from '../chart'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

function getMostRecentPoint(points: any[]) {
    if (!points || points.length === 0) return undefined
    let best = points[0]
    for (const p of points) {
        if ((p?.idx ?? -Infinity) > (best?.idx ?? -Infinity)) best = p
    }
    return best
}

function formatValue(dimension: DataDimension, raw: any) {
    if (raw === undefined || raw === null) return '—'
    return dimension.formatter ? dimension.formatter(raw) : raw
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

    const chartConfig = useMemo(() => {
        return componentData?.componentType ? CHART_CONFIG[componentData.componentType] : undefined
    }, [componentData?.componentType])

    const mostRecent = useMemo(() => {
        return getMostRecentPoint(componentData?.data ?? [])
    }, [componentData?.data])

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

    const convertedData = useMemo(() => {
        const points = componentData?.data ?? []
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
    }, [componentData?.data, chartConfig])

    const hasD1 = !!chartConfig?.dimension1
    const hasD2 = !!chartConfig?.dimension2

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

                {/* Metric tiles */}
                {(hasD1 || hasD2) && (
                    <Grid container spacing={2}>
                        {hasD1 && chartConfig?.dimension1 && (
                            <Grid size={{ xs: 12, md: hasD2 ? 6 : 12 }}>
                                <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                                    <Stack spacing={0.5}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    bgcolor: 'primary.main',
                                                }}
                                            />
                                            <Typography variant="caption" color="text.secondary" fontWeight={700}>
                                                {chartConfig.dimension1.name ?? 'Metric'}
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row" spacing={1} alignItems="baseline">
                                            <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.1 }}>
                                                {mostRecent ? formatValue(chartConfig.dimension1, mostRecent[chartConfig.dimension1.key]) : '—'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" fontWeight={700}>
                                                {chartConfig.dimension1.label}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            </Grid>
                        )}

                        {hasD2 && chartConfig?.dimension2 && (
                            <Grid size={{ xs: 12, md: hasD2 ? 6 : 12 }}>
                                <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                                    <Stack spacing={0.5}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    bgcolor: 'secondary.main',
                                                }}
                                            />
                                            <Typography variant="caption" color="text.secondary" fontWeight={700}>
                                                {chartConfig.dimension2.name ?? 'Metric'}
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row" spacing={1} alignItems="baseline">
                                            <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.1 }}>
                                                {mostRecent ? formatValue(chartConfig.dimension2, mostRecent[chartConfig.dimension2.key]) : '—'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" fontWeight={700}>
                                                {chartConfig.dimension2.label}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                )}

                {/* Chart card */}
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Box sx={{ px: 2, pt: 1 }}>
                        <Tabs
                            value={interval}
                            onChange={(_, v) => switchInterval(v)}
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
                        {/* lightweight loading overlay */}
                        {loading && (
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
        </AppContent>
    )
}
