"use client"

import React, { useEffect, useMemo, useState } from "react"
import data, { ComponentData } from "../../../../client/data"
import componentClient, { Component } from "../../../../client/component"
import { currentCoop } from "../../coop-context"
import { AppContent } from "../../../../components/app-content"
import { usePageTitle } from "../../../../components/app-bar"
import ChartCard from "../../../../components/dashboard/chart-card"
import { CHART_CONFIG } from "../../../../utils/chart-config"

import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import SectionPaper from "../../../../components/section-paper"

export default function UngroupedDashboard() {
  usePageTitle("Ungrouped")

  const coopId = currentCoop()

  const [coopData, setCoopData] = useState<ComponentData[]>([])
  const [components, setComponents] = useState<Component[]>([])
  const [hasDataLoaded, setHasDataLoaded] = useState(false)
  const [hasComponentsLoaded, setHasComponentsLoaded] = useState(false)

  useEffect(() => {
    data.getCoopData(coopId, (result: ComponentData[]) => {
      setCoopData(result ?? [])
      setHasDataLoaded(true)
    })
    componentClient.list(coopId, (result: Component[]) => {
      setComponents(result ?? [])
      setHasComponentsLoaded(true)
    })
  }, [coopId])

  const componentsById = useMemo(() => {
    const map: Record<string, Component> = {}
    components.forEach((c) => {
      map[c.id] = c
    })
    return map
  }, [components])

  const ungrouped = useMemo(() => {
    return coopData.filter(
        (d) => !!CHART_CONFIG[d.componentType] && (componentsById[d.componentId]?.areas ?? []).length === 0
    )
  }, [coopData, componentsById])

  return (
      <AppContent hasLoaded={hasDataLoaded && hasComponentsLoaded}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Ungrouped
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              Devices that don&apos;t belong to a group yet.
            </Typography>
          </Box>

          {ungrouped.length === 0 ? (
              <SectionPaper sx={{ p: 3, textAlign: "center", bgcolor: "background.paper" }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Nothing here
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Every device now belongs to at least one group.
                </Typography>
              </SectionPaper>
          ) : (
              <Grid container spacing={2} sx={{ width: "100%" }}>
                {ungrouped.map((d) => (
                    <Grid key={d.componentId} size={{ xs: 12, md: 6, lg: 4 }}>
                      <ChartCard
                          name={d.componentName}
                          type={d.componentTypeDescription}
                          data={d}
                          dimension1={CHART_CONFIG[d.componentType].dimension1}
                          dimension2={CHART_CONFIG[d.componentType].dimension2}
                          href={`/${coopId}/dashboard/${d.componentId}`}
                      />
                    </Grid>
                ))}
              </Grid>
          )}
        </Stack>
      </AppContent>
  )
}
