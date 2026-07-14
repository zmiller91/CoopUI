'use client'

import React, { useMemo } from 'react'
import { CHART_CONFIG } from '../../utils/chart-config'
import { ComponentDetailContentProps } from './registry'
import MetricTiles, { getMostRecentPoint, formatValue } from './metric-tiles'
import Chart from '../../app/[coopId]/dashboard/chart'
import { MetricInterval } from '../../client/data'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import CircularProgress from '@mui/material/CircularProgress'

// Fallback for any componentType without a COMPONENT_DETAIL_REGISTRY entry - chartConfig-driven
// tiles + the generic sparkline-style Chart, same behavior every type had before per-type detail
// content existed.
export default function GenericComponentDetail(props: ComponentDetailContentProps) {
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
