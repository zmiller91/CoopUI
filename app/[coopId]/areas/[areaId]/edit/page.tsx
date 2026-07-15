'use client'

import React, { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import areaClient, { Area } from "../../../../../client/area"
import componentClient, { Component } from "../../../../../client/component"
import { currentCoop } from "../../../coop-context"
import { AppContent } from "../../../../../components/app-content"
import { usePageTitle } from "../../../../../components/app-bar"
import { AREA_TYPE_META } from "../../../../../components/dashboard/group-card"
import AddAreaDialog from "../../../../../features/areas/add-area-dialog"
import { getChildAreaTypeOptions } from "../../../../../features/areas/child-area-types"
import TextInput from "../../../../../components/form/text-input"
import SelectInput, { SelectOption } from "../../../../../components/form/select"
import ConfirmDialog from "../../../../../components/dialog/confirm"
import SnackBar from "../../../../../components/snack-bar"

import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import SectionPaper from "../../../../../components/section-paper"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import CloseIcon from "@mui/icons-material/Close"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import AddIcon from "@mui/icons-material/Add"
import DeleteOutline from "@mui/icons-material/DeleteOutline"

function currentArea(): string {
    return useParams()["areaId"] as string
}

export default function AreaEdit() {
    const coopId = currentCoop()
    const areaId = currentArea()
    const router = useRouter()

    const [areas, setAreas] = useState<Area[]>([])
    const [components, setComponents] = useState<Component[]>([])
    const [hasAreasLoaded, setHasAreasLoaded] = useState(false)
    const [hasComponentsLoaded, setHasComponentsLoaded] = useState(false)
    const hasLoaded = hasAreasLoaded && hasComponentsLoaded

    const area = useMemo(() => areas.find((a) => a.id === areaId), [areas, areaId])
    usePageTitle(area ? `Edit ${area.name}` : "Edit Group")

    const [name, setName] = useState("")
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [originalIds, setOriginalIds] = useState<string[]>([])
    const [pickerValue, setPickerValue] = useState("")
    const [selectedPortKeys, setSelectedPortKeys] = useState<string[]>([])
    const [originalPortKeys, setOriginalPortKeys] = useState<string[]>([])
    const [portPickerValue, setPortPickerValue] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [addChildOpen, setAddChildOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState("")
    const [snackShowing, setSnackShowing] = useState(false)

    useEffect(() => {
        areaClient.list(coopId, (r) => {
            setAreas(r.areas ?? [])
            setHasAreasLoaded(true)
        })
        componentClient.list(coopId, (r) => {
            setComponents(r ?? [])
            setHasComponentsLoaded(true)
        })
    }, [coopId])

    useEffect(() => {
        if (!area) return
        setName(area.name)
    }, [area])

    useEffect(() => {
        if (!hasComponentsLoaded) return
        const currentMemberIds = components
            .filter((c) => (c.areas ?? []).some((a) => a.id === areaId))
            .map((c) => c.id)
        setSelectedIds(currentMemberIds)
        setOriginalIds(currentMemberIds)
    }, [hasComponentsLoaded, components, areaId])

    // This area plus every ancestor up the parent chain - a valve counts as "available" for port
    // association if it's assigned (as a whole device) to any area in this chain, not just this one.
    const ancestorIds = useMemo(() => {
        const areasById = new Map(areas.map((a) => [a.id, a]))
        const ids: string[] = []
        let current = area
        while (current) {
            if (current.id) ids.push(current.id)
            current = current.parentId ? areasById.get(current.parentId) : undefined
        }
        return ids
    }, [area, areas])

    const availableValves = useMemo(() => {
        return components.filter(
            (c) => c.type === "VALVE" && (c.areas ?? []).some((a) => ancestorIds.includes(a.id as string))
        )
    }, [components, ancestorIds])

    function portKey(componentId: string, portIndex: number) {
        return `${componentId}:${portIndex}`
    }

    useEffect(() => {
        if (!hasComponentsLoaded) return
        const currentPortKeys = availableValves.flatMap((v) =>
            (v.ports ?? [])
                .filter((p) => (p.areas ?? []).some((a) => a.id === areaId))
                .map((p) => portKey(v.id, p.index))
        )
        setSelectedPortKeys(currentPortKeys)
        setOriginalPortKeys(currentPortKeys)
    }, [hasComponentsLoaded, availableValves, areaId])

    const componentsById = useMemo(() => {
        const map: Record<string, Component> = {}
        components.forEach((c) => {
            map[c.id] = c
        })
        return map
    }, [components])

    const selectedComponents = useMemo(() => {
        return selectedIds.map((id) => componentsById[id]).filter((c): c is Component => !!c)
    }, [selectedIds, componentsById])

    const pickerOptions = useMemo<SelectOption[]>(() => {
        return components
            .filter((c) => !selectedIds.includes(c.id))
            .map((c) => ({ label: `${c.name} (${c.serial})`, value: c.id }))
    }, [components, selectedIds])

    function onPick(value: string) {
        if (!value) return
        setSelectedIds((prev) => [...prev, value])
        setPickerValue("")
    }

    function removeMember(id: string) {
        setSelectedIds((prev) => prev.filter((x) => x !== id))
    }

    const portPickerOptions = useMemo<SelectOption[]>(() => {
        return availableValves.flatMap((v) =>
            (v.ports ?? [])
                .filter((p) => !selectedPortKeys.includes(portKey(v.id, p.index)))
                .map((p) => ({ label: `${v.name} — ${p.name}`, value: portKey(v.id, p.index) }))
        )
    }, [availableValves, selectedPortKeys])

    const selectedPorts = useMemo(() => {
        return selectedPortKeys.map((key) => {
            const [componentId, indexStr] = key.split(":")
            const valve = availableValves.find((v) => v.id === componentId)
            const port = valve?.ports.find((p) => p.index === Number(indexStr))
            return { key, valveName: valve?.name ?? "Unknown device", portName: port?.name ?? `Zone ${Number(indexStr) + 1}` }
        })
    }, [selectedPortKeys, availableValves])

    function onPortPick(value: string) {
        if (!value) return
        setSelectedPortKeys((prev) => [...prev, value])
        setPortPickerValue("")
    }

    function removePort(key: string) {
        setSelectedPortKeys((prev) => prev.filter((k) => k !== key))
    }

    const childGroups = useMemo(() => {
        return areas.filter((a) => a.parentId === areaId)
    }, [areas, areaId])

    const childTypeOptions = useMemo(() => {
        return area ? getChildAreaTypeOptions(area.type) : []
    }, [area])

    function onChildCreated(child: Area) {
        areaClient.add(coopId, { area: { ...child, parentId: areaId } }, (response) => {
            setAreas((prev) => [...prev, response.area])
        })
    }

    function deleteArea() {
        areaClient.delete(
            coopId,
            areaId,
            () => router.push(`/${coopId}/dashboard`),
            () => {
                setOpenDelete(false)
                setSnackMessage("This group still has sub-groups and can't be deleted yet.")
                setSnackShowing(true)
            }
        )
    }

    function save() {
        if (!area) return
        setIsSaving(true)

        function finish() {
            setIsSaving(false)
            router.push(`/${coopId}/areas/${areaId}`)
        }

        // Port area-membership isn't covered by the bulk component endpoint (that only replaces a whole
        // component's areas, not one port's), so changed ports are saved one at a time.
        function savePorts(remaining: string[]) {
            if (remaining.length === 0) {
                finish()
                return
            }

            const [key, ...rest] = remaining
            const [componentId, indexStr] = key.split(":")
            const portIndex = Number(indexStr)
            const valve = availableValves.find((v) => v.id === componentId)
            const currentAreaIds = (valve?.ports.find((p) => p.index === portIndex)?.areas ?? []).map((a) => a.id as string)
            const nowSelected = selectedPortKeys.includes(key)
            const areaIds = nowSelected
                ? Array.from(new Set([...currentAreaIds, areaId]))
                : currentAreaIds.filter((id) => id !== areaId)

            areaClient.setPortAreas(coopId, componentId, portIndex, { areaIds }, () => savePorts(rest))
        }

        areaClient.update(
            coopId,
            { area: { id: area.id, name: name.trim(), type: area.type, parentId: area.parentId } },
            () => {
                const added = selectedIds.filter((id) => !originalIds.includes(id))
                const removed = originalIds.filter((id) => !selectedIds.includes(id))
                const changed = [...added, ...removed]

                const addedPorts = selectedPortKeys.filter((k) => !originalPortKeys.includes(k))
                const removedPorts = originalPortKeys.filter((k) => !selectedPortKeys.includes(k))
                const changedPorts = [...addedPorts, ...removedPorts]

                if (changed.length === 0) {
                    savePorts(changedPorts)
                    return
                }

                const assignments = changed.map((componentId) => {
                    const component = componentsById[componentId]
                    const currentAreaIds = (component?.areas ?? []).map((a) => a.id as string)
                    const nowSelected = selectedIds.includes(componentId)
                    const areaIds = nowSelected
                        ? Array.from(new Set([...currentAreaIds, areaId]))
                        : currentAreaIds.filter((id) => id !== areaId)
                    return { componentId, areaIds }
                })

                areaClient.setComponentAreasBulk(coopId, { assignments }, () => savePorts(changedPorts))
            }
        )
    }

    const typeMeta = area ? AREA_TYPE_META[area.type] : undefined

    return (
        <AppContent hasLoaded={hasLoaded}>
            <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                        aria-label="Back to group"
                        onClick={() => router.push(`/${coopId}/areas/${areaId}`)}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" fontWeight={700}>
                        Edit Group
                    </Typography>
                </Stack>

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
                    <>
                        <SectionPaper>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                                Details
                            </Typography>

                            {typeMeta && (
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                                    {typeMeta.icon}
                                    <Typography variant="body2" color="text.secondary">
                                        {typeMeta.label}
                                    </Typography>
                                </Stack>
                            )}

                            <TextInput id="name" title="Name" value={name} onChange={setName} required />
                        </SectionPaper>

                        <SectionPaper>
                            <Typography variant="subtitle1" fontWeight={700}>
                                Members
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                Choose which devices belong to this group.
                            </Typography>

                            <SelectInput
                                id="add-device"
                                title="Add a device"
                                placeholder="Select a device..."
                                value={pickerValue}
                                onChange={onPick}
                                options={pickerOptions}
                            />

                            <Box sx={{ mt: 1.5 }}>
                                {selectedComponents.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary">
                                        No devices selected yet.
                                    </Typography>
                                ) : (
                                    <List disablePadding>
                                        {selectedComponents.map((c) => (
                                            <ListItem
                                                key={c.id}
                                                disableGutters
                                                secondaryAction={
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="Remove"
                                                        onClick={() => removeMember(c.id)}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemText primary={c.name} secondary={c.serial} />
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Box>
                        </SectionPaper>

                        {area?.type === "GARDEN_BED" && availableValves.length > 0 && (
                            <SectionPaper>
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Irrigation
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                    Associate this garden bed with a zone on one of its irrigation controllers.
                                </Typography>

                                <SelectInput
                                    id="add-port"
                                    title="Add a zone"
                                    placeholder="Select a zone..."
                                    value={portPickerValue}
                                    onChange={onPortPick}
                                    options={portPickerOptions}
                                />

                                <Box sx={{ mt: 1.5 }}>
                                    {selectedPorts.length === 0 ? (
                                        <Typography variant="body2" color="text.secondary">
                                            No zones associated yet.
                                        </Typography>
                                    ) : (
                                        <List disablePadding>
                                            {selectedPorts.map((p) => (
                                                <ListItem
                                                    key={p.key}
                                                    disableGutters
                                                    secondaryAction={
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="Remove"
                                                            onClick={() => removePort(p.key)}
                                                        >
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                    }
                                                >
                                                    <ListItemText primary={p.portName} secondary={p.valveName} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    )}
                                </Box>
                            </SectionPaper>
                        )}

                        {childTypeOptions.length > 0 && (
                            <SectionPaper>
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Child Groups
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                    Nest other groups under this one.
                                </Typography>

                                {childGroups.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                        No child groups yet.
                                    </Typography>
                                ) : (
                                    <List disablePadding sx={{ mb: 1.5 }}>
                                        {childGroups.map((child) => {
                                            const childMeta = AREA_TYPE_META[child.type]
                                            return (
                                                <ListItem key={child.id} disableGutters disablePadding>
                                                    <ListItemButton
                                                        onClick={() => router.push(`/${coopId}/areas/${child.id}/edit`)}
                                                    >
                                                        <ListItemText
                                                            primary={child.name}
                                                            secondary={childMeta?.label ?? child.type}
                                                        />
                                                        <ChevronRightIcon fontSize="small" color="action" />
                                                    </ListItemButton>
                                                </ListItem>
                                            )
                                        })}
                                    </List>
                                )}

                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<AddIcon />}
                                    onClick={() => setAddChildOpen(true)}
                                >
                                    Add Child Group
                                </Button>
                            </SectionPaper>
                        )}

                        <Button variant="contained" color="primary" fullWidth onClick={save} disabled={isSaving}>
                            Save
                        </Button>

                        <Button variant="text" color="error" fullWidth onClick={() => setOpenDelete(true)}>
                            Delete Group
                        </Button>

                        <ConfirmDialog
                            title="Delete group?"
                            confirmLabel="Delete"
                            confirmIcon={<DeleteOutline />}
                            confirmColor="error"
                            onConfirm={deleteArea}
                            onCancel={() => setOpenDelete(false)}
                            open={openDelete}
                        >
                            <Typography variant="body2" color="text.secondary">
                                This removes &quot;{area?.name}&quot; and its device assignments. This action cannot
                                be undone.
                            </Typography>
                        </ConfirmDialog>
                    </>
                )}
            </Stack>

            <AddAreaDialog
                open={addChildOpen}
                handleSubmit={onChildCreated}
                handleClose={() => setAddChildOpen(false)}
                typeOptions={childTypeOptions}
            />

            <SnackBar message={snackMessage} display={snackShowing} callback={setSnackShowing} />
        </AppContent>
    )
}
