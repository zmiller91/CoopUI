'use client'

import React from "react"
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
import { ancestorIds, availableValves, associatedPortKeys, parsePortKey } from "./garden-bed-irrigation"

export default function GardenBedDetailContent(props: AreaDetailContentProps) {
    const router = useRouter()

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
            portName: port?.name ?? `Zone ${portIndex + 1}`,
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
                                    <ChevronRightIcon fontSize="small" color="action" />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            </SectionPaper>
        </Stack>
    )
}
