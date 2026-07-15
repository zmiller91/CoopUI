'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import AddIcon from "@mui/icons-material/Add"
import SectionPaper from "../../../components/section-paper"
import GenericAreaDetailContent from "../generic-area-detail-content"
import { AreaDetailContentProps } from "../registry"
import { ancestorIds } from "../area-lineage"
import { availableValves, associatedPortKeys, parsePortKey } from "../../devices/valve/valve-areas"
import { defaultZoneName } from "../../../utils/valve"
import ValveStateChip from "../../devices/valve/valve-state-chip"
import areaClient, { ActivityEntry } from "../../../client/area"
import { ActivityLog } from "../../activity/activity-log"

const ACTIVITY_LIMIT = 20
const ACTIVITY_WINDOW_MS = 5 * 24 * 60 * 60 * 1000

export default function GardenBedDetailContent(props: AreaDetailContentProps) {
    const router = useRouter()

    const [activity, setActivity] = useState<ActivityEntry[]>([])
    const [hasActivityLoaded, setHasActivityLoaded] = useState(false)

    useEffect(() => {
        if (!props.area.id) return
        areaClient.getActivity(props.coopId, props.area.id, (r) => {
            const cutoff = Date.now() - ACTIVITY_WINDOW_MS
            const recent = (r.entries ?? [])
                .filter((e) => e.createdAt >= cutoff)
                .slice(0, ACTIVITY_LIMIT)
            setActivity(recent)
            setHasActivityLoaded(true)
        })
    }, [props.coopId, props.area.id])

    const valves = availableValves(props.allComponents, ancestorIds(props.area, props.areas))

    if (valves.length === 0) {
        return <GenericAreaDetailContent {...props} />
    }

    const links = associatedPortKeys(props.area.id as string, valves).map((key) => {
        const { componentId, portIndex } = parsePortKey(key)
        const valve = valves.find((v) => v.id === componentId)
        const port = valve?.ports.find((p) => p.index === portIndex)
        return {
            key,
            componentId,
            valveName: valve?.name ?? "Unknown device",
            portName: port?.name ?? defaultZoneName(portIndex),
            on: port?.state === "ON",
        }
    })

    return (
        <Stack spacing={2}>
            <GenericAreaDetailContent {...props} />

            <SectionPaper>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                    Irrigation
                </Typography>

                {links.length === 0 ? (
                    <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            No irrigation links yet.
                        </Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<AddIcon />}
                            onClick={() => router.push(`/${props.coopId}/areas/${props.area.id}/edit`)}
                        >
                            Add Irrigation Link
                        </Button>
                    </>
                ) : (
                    <List disablePadding>
                        {links.map((link) => (
                            <ListItem key={link.key} disableGutters disablePadding>
                                <ListItemButton onClick={() => router.push(`/${props.coopId}/components/${link.componentId}`)}>
                                    <ListItemText primary={link.portName} secondary={link.valveName} />
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <ValveStateChip on={link.on} />
                                        <ChevronRightIcon fontSize="small" color="action" />
                                    </Stack>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            </SectionPaper>

            {links.length > 0 && (
                <SectionPaper>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
                        Valve Activity
                    </Typography>

                    {hasActivityLoaded && (
                        <ActivityLog entries={activity} memberComponents={valves} />
                    )}
                </SectionPaper>
            )}
        </Stack>
    )
}
