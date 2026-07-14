'use client'

import React, { ReactNode } from "react"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Box from "@mui/material/Box"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { AREA_TYPE_META } from "../../components/dashboard/group-card"
import { AreaPreviewLineProps } from "./registry"

// Canonical registry-conforming shape (matches AreaPreviewLineProps in registry.tsx), plus an optional
// `children` slot rendered between the name/type text and the chevron - the hook a custom preview line
// (e.g. GardenBedPreviewLine) uses to add its own stat(s) without duplicating this row's layout.
export interface GenericAreaPreviewLineProps extends AreaPreviewLineProps {
    children?: ReactNode;
}

export default function GenericAreaPreviewLine(props: GenericAreaPreviewLineProps) {
    const typeMeta = AREA_TYPE_META[props.area.type]

    return (
        <ListItem disableGutters disablePadding>
            <ListItemButton onClick={props.onClick}>
                <ListItemText
                    primary={props.area.name}
                    secondary={typeMeta?.label ?? props.area.type}
                />
                {props.children && <Box sx={{ mr: 1 }}>{props.children}</Box>}
                <ChevronRightIcon fontSize="small" color="action" />
            </ListItemButton>
        </ListItem>
    )
}
