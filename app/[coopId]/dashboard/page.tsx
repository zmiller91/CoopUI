"use client"

import React, { useEffect, useMemo, useState } from "react"
import data from "../../../client/data"
import { currentCoop } from "../coop-context"
import { AppContent } from "../../../components/app-content"
import ChartCard from "../../../components/dashboard/chart-card"
import { CHART_CONFIG } from "../../../utils/chart-config"

import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"

import SearchIcon from "@mui/icons-material/Search"
import ClearIcon from "@mui/icons-material/Clear"
import DashboardIcon from "@mui/icons-material/Dashboard"

function normalize(s: string) {
  return (s || "").toLowerCase().trim()
}

export default function Dashboard() {
  const [coopData, setCoopData] = useState<any[]>([])
  const [hasLoaded, setHasLoaded] = useState(false)
  const [query, setQuery] = useState("")
  const coopId = currentCoop()

  useEffect(() => {
    data.getCoopData(coopId, (result: any[]) => {
      setCoopData(result ?? [])
      setHasLoaded(true)
    })
  }, [coopId])

  const chartable = useMemo(() => {
    return coopData.filter((d) => !!CHART_CONFIG[d.componentType])
  }, [coopData])

  const filtered = useMemo(() => {
    const q = normalize(query)
    if (!q) return chartable
    return chartable.filter((d) => {
      const hay = `${d.componentName} ${d.componentTypeDescription} ${d.componentId}`.toLowerCase()
      return hay.includes(q)
    })
  }, [chartable, query])

  return (
      <AppContent hasLoaded={hasLoaded}>
        <Stack spacing={2}>
          {/* Header */}
          <Stack direction="row" alignItems="flex-end" justifyContent="space-between" spacing={2}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" fontWeight={700} noWrap>
                Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                Quick view of your active sensors and systems
              </Typography>
            </Box>

            <Chip label={`${chartable.length} cards`} size="small" sx={{ flexShrink: 0 }} />
          </Stack>

          {/* Search */}
          {chartable.length > 0 && (
              <TextField
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sensors, devices, or types…"
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                    ),
                    endAdornment: query ? (
                        <InputAdornment position="end">
                          <IconButton
                              aria-label="Clear search"
                              edge="end"
                              size="small"
                              onClick={() => setQuery("")}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                    ) : undefined,
                  }}
              />
          )}

          {/* Empty state */}
          {chartable.length === 0 ? (
              <Paper
                  variant="outlined"
                  sx={{ p: 3, borderRadius: 2, textAlign: "center", bgcolor: "background.paper" }}
              >
                <Stack spacing={1.5} alignItems="center">
                  <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "grey.100",
                      }}
                  >
                    <DashboardIcon />
                  </Box>

                  <Typography variant="subtitle1" fontWeight={700}>
                    Nothing to show yet
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
                    Register components and start reporting data to see charts appear here.
                  </Typography>

                  {/* Optional CTA if you have a route */}
                  <Button variant="contained" onClick={() => (window.location.href = `/${coopId}/components/register`)}>
                    Register a component
                  </Button>
                </Stack>
              </Paper>
          ) : filtered.length === 0 ? (
              <Paper
                  variant="outlined"
                  sx={{ p: 3, borderRadius: 2, textAlign: "center", bgcolor: "background.paper" }}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  No matches
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Try a different search term.
                </Typography>
              </Paper>
          ) : (
              <Grid container spacing={2} sx={{ width: "100%" }}>
                {filtered.map((d) => (
                    <Grid key={d.componentId} size={{ xs: 12, md: 6, lg: 4 }}>
                      <ChartCard
                          name={d.componentName}
                          type={d.componentTypeDescription}
                          data={d}
                          dimension1={CHART_CONFIG[d.componentType].dimension1}
                          dimension2={CHART_CONFIG[d.componentType].dimension2}
                      />
                    </Grid>
                ))}
              </Grid>
          )}
        </Stack>
      </AppContent>
  )
}
