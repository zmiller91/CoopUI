"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import data, { ComponentData } from "../../../client/data"
import componentClient, { Component } from "../../../client/component"
import areaClient, { Area } from "../../../client/area"
import { currentCoop } from "../coop-context"
import { AppContent } from "../../../components/app-content"
import GroupCard, { GroupTileLayout } from "../../../components/dashboard/group-card"
import { AREA_CARD_REGISTRY } from "../../../features/areas/registry"
import AddAreaDialog from "../../../features/areas/add-area-dialog"
import FloatingActionButton from "../../../components/fab"

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
import AddIcon from "@mui/icons-material/Add"
import Inventory2Icon from "@mui/icons-material/Inventory2"

interface Group {
  area: Area
  members: ComponentData[]
}

function normalize(s: string) {
  return (s || "").toLowerCase().trim()
}

// Walks a.parentId up to the root - a component assigned to a child group (e.g. a Garden Bed) rolls
// up to its top-level ancestor (the Garden) for Dashboard tile purposes, rather than only counting
// toward direct assignments.
function topLevelAncestorId(areaById: Record<string, Area>, area: Area): string | undefined {
  let current: Area | undefined = area
  const seen = new Set<string>()
  while (current?.parentId) {
    const currentId = current.id as string
    if (seen.has(currentId)) break
    seen.add(currentId)
    const parent = areaById[current.parentId]
    if (!parent) break
    current = parent
  }
  return current?.id
}

export default function Dashboard() {
  const coopId = currentCoop()
  const router = useRouter()

  const [coopData, setCoopData] = useState<ComponentData[]>([])
  const [components, setComponents] = useState<Component[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [hasDataLoaded, setHasDataLoaded] = useState(false)
  const [hasComponentsLoaded, setHasComponentsLoaded] = useState(false)
  const [hasAreasLoaded, setHasAreasLoaded] = useState(false)
  const [query, setQuery] = useState("")
  const [addGroupOpen, setAddGroupOpen] = useState(false)

  const hasLoaded = hasDataLoaded && hasComponentsLoaded && hasAreasLoaded

  useEffect(() => {
    data.getCoopData(coopId, (result: ComponentData[]) => {
      setCoopData(result ?? [])
      setHasDataLoaded(true)
    })
    componentClient.list(coopId, (result: Component[]) => {
      setComponents(result ?? [])
      setHasComponentsLoaded(true)
    })
    areaClient.list(coopId, (result) => {
      setAreas(result.areas ?? [])
      setHasAreasLoaded(true)
    })
  }, [coopId])

  const componentsById = useMemo(() => {
    const map: Record<string, Component> = {}
    components.forEach((c) => {
      map[c.id] = c
    })
    return map
  }, [components])

  const areaById = useMemo(() => {
    const map: Record<string, Area> = {}
    areas.forEach((a) => {
      map[a.id as string] = a
    })
    return map
  }, [areas])

  const { groups, ungrouped } = useMemo(() => {
    // Dashboard tiles are top-level groups only - a group with a parentId is a child and gets
    // its own tile on the parent's Edit page instead, not here. Components roll up to their
    // top-level ancestor's tile regardless of how deep they're actually assigned.
    const byAreaId: Record<string, Group> = {}
    areas
      .filter((a) => !a.parentId)
      .forEach((a) => {
        byAreaId[a.id as string] = { area: a, members: [] }
      })

    const ungrouped: ComponentData[] = []

    coopData.forEach((d) => {
      const componentAreas = componentsById[d.componentId]?.areas ?? []
      const rootIds = new Set(
        componentAreas
          .map((a) => topLevelAncestorId(areaById, a))
          .filter((id): id is string => !!id && !!byAreaId[id])
      )

      // A component with no area assignment (or one that somehow resolves to nothing, e.g. a
      // dangling parentId) falls back to Ungrouped rather than silently disappearing.
      if (rootIds.size === 0) {
        ungrouped.push(d)
        return
      }

      rootIds.forEach((id) => {
        byAreaId[id].members.push(d)
      })
    })

    return { groups: Object.values(byAreaId), ungrouped }
  }, [coopData, componentsById, areas, areaById])

  const componentsByAreaId = useMemo(() => {
    // Parallel to the `groups` memo above, but over every Component (not just chartable ones) -
    // type-specific cards need raw Component/port data (e.g. valve zone state) that ComponentData
    // doesn't carry. Same descendant rollup as `groups`.
    const topLevelIds = new Set(areas.filter((a) => !a.parentId).map((a) => a.id as string))
    const map: Record<string, Component[]> = {}
    components.forEach((c) => {
      const rootIds = new Set(
        (c.areas ?? [])
          .map((a) => topLevelAncestorId(areaById, a))
          .filter((id): id is string => !!id && topLevelIds.has(id))
      )
      rootIds.forEach((id) => {
        if (!map[id]) map[id] = []
        map[id].push(c)
      })
    })
    return map
  }, [components, areas, areaById])

  const filteredGroups = useMemo(() => {
    const q = normalize(query)
    if (!q) return groups
    return groups.filter((g) => normalize(g.area.name).includes(q))
  }, [groups, query])

  const showUngrouped = ungrouped.length > 0 && (!query || normalize("ungrouped").includes(normalize(query)))

  function onAreaCreated(area: Area) {
    areaClient.add(coopId, { area }, (response) => {
      router.push(`/${coopId}/areas/${response.area.id}`)
    })
  }

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
                Devices organized by area
              </Typography>
            </Box>

            <Chip label={`${groups.length} groups`} size="small" sx={{ flexShrink: 0 }} />
          </Stack>

          {/* Search */}
          {(groups.length > 0 || ungrouped.length > 0) && (
              <TextField
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search groups…"
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

          {/* Empty state: nothing reporting at all */}
          {coopData.length === 0 ? (
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
                    Register components and start reporting data to see groups appear here.
                  </Typography>

                  <Button variant="contained" onClick={() => (window.location.href = `/${coopId}/components/register`)}>
                    Register a component
                  </Button>
                </Stack>
              </Paper>
          ) : (
              <>
                {groups.length === 0 && (
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        No groups yet — create one to organize your devices, or view them under Ungrouped below.
                      </Typography>
                    </Paper>
                )}

                {filteredGroups.length === 0 && !showUngrouped ? (
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
                      {filteredGroups.map((g) => {
                        const CardComponent = AREA_CARD_REGISTRY[g.area.type] ?? GroupCard
                        return (
                            <Grid key={g.area.id} size={{ xs: 12, md: 6, lg: 4 }}>
                              <CardComponent
                                  area={g.area}
                                  members={g.members}
                                  memberComponents={componentsByAreaId[g.area.id as string] ?? []}
                                  onClick={() => router.push(`/${coopId}/areas/${g.area.id}`)}
                              />
                            </Grid>
                        )
                      })}

                      {showUngrouped && (
                          <Grid key="ungrouped" size={{ xs: 12, md: 6, lg: 4 }}>
                            <GroupTileLayout
                                name="Ungrouped"
                                label="Ungrouped"
                                icon={<Inventory2Icon fontSize="small" />}
                                memberCount={ungrouped.length}
                                onClick={() => router.push(`/${coopId}/dashboard/ungrouped`)}
                            />
                          </Grid>
                      )}
                    </Grid>
                )}
              </>
          )}
        </Stack>

        <AddAreaDialog
            open={addGroupOpen}
            handleSubmit={onAreaCreated}
            handleClose={() => setAddGroupOpen(false)}
        />

        <FloatingActionButton label="Add group" onClick={() => setAddGroupOpen(true)}>
          <AddIcon />
        </FloatingActionButton>
      </AppContent>
  )
}
