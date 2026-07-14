'use client'

import React from 'react'
import { ChartConfig, DataDimension } from '../../utils/chart-config'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

export function getMostRecentPoint(points: any[]) {
    if (!points || points.length === 0) return undefined
    let best = points[0]
    for (const p of points) {
        if ((p?.idx ?? -Infinity) > (best?.idx ?? -Infinity)) best = p
    }
    return best
}

export function formatValue(dimension: DataDimension, raw: any) {
    if (raw === undefined || raw === null) return '—'
    return dimension.formatter ? dimension.formatter(raw) : raw
}

function MetricTile(props: { dimension: DataDimension; mostRecent: any; dotColor: 'primary.main' | 'secondary.main'; fullWidth: boolean }) {
    return (
        <Grid size={{ xs: 12, md: props.fullWidth ? 12 : 6 }}>
            <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                <Stack spacing={0.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: props.dotColor,
                            }}
                        />
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>
                            {props.dimension.name ?? 'Metric'}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="baseline">
                        <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.1 }}>
                            {props.mostRecent ? formatValue(props.dimension, props.mostRecent[props.dimension.key]) : '—'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={700}>
                            {props.dimension.label}
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>
        </Grid>
    )
}

export interface MetricTilesProps {
    chartConfig?: ChartConfig;
    mostRecent: any;
}

export default function MetricTiles(props: MetricTilesProps) {
    const hasD1 = !!props.chartConfig?.dimension1
    const hasD2 = !!props.chartConfig?.dimension2

    if (!hasD1 && !hasD2) return null

    return (
        <Grid container spacing={2}>
            {hasD1 && props.chartConfig?.dimension1 && (
                <MetricTile dimension={props.chartConfig.dimension1} mostRecent={props.mostRecent} dotColor="primary.main" fullWidth={!hasD2} />
            )}
            {hasD2 && props.chartConfig?.dimension2 && (
                <MetricTile dimension={props.chartConfig.dimension2} mostRecent={props.mostRecent} dotColor="secondary.main" fullWidth={!hasD1} />
            )}
        </Grid>
    )
}
