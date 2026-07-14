'use client'

import React from 'react'
import { CHART_CONFIG } from '../../../utils/chart-config'
import { ComponentDetailContentProps } from '../registry'
import MetricTiles, { getMostRecentPoint } from '../metric-tiles'
import ForecastChart from './forecast-chart'
import { MetricInterval } from '../../../client/data'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import CircularProgress from '@mui/material/CircularProgress'

export default function ForecastComponentDetail(props: ComponentDetailContentProps) {
    const chartConfig = CHART_CONFIG.WEATHER_FORECAST
    const mostRecent = getMostRecentPoint(props.componentData?.data ?? [])

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

                    <ForecastChart data={props.componentData?.data ?? []} detailed={true} />
                </Box>
            </Paper>
        </Stack>
    )
}
