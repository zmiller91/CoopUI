'use client'

import React from "react"
import Chip from "@mui/material/Chip"

export interface ValveStateChipProps {
    on: boolean;
}

export default function ValveStateChip(props: ValveStateChipProps) {
    return (
        <Chip
            label={props.on ? "On" : "Off"}
            size="small"
            variant={props.on ? "filled" : "outlined"}
            sx={{
                flexShrink: 0,
                fontWeight: 700,
                ...(props.on
                    ? { bgcolor: "success.main", color: "success.contrastText" }
                    : { borderColor: "divider", color: "text.secondary" }),
            }}
        />
    )
}
