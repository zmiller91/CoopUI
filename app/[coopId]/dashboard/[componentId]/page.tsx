'use client'

import React, { useEffect, useMemo, useState } from 'react'
import data, { ComponentData, MetricInterval } from '../../../../client/data'
import { currentCoop } from '../../coop-context'
import { currentComponent } from './component-context'
import { AppContent } from '../../../../components/app-content'
import { StatusInfo } from '../status-info'
import { COMPONENT_DETAIL_REGISTRY } from '../../../../features/components/registry'
import GenericComponentDetail from '../../../../features/components/generic-component-detail'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

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
