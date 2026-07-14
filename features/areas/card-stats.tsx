'use client'

import React from "react"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

export interface StatRowProps {
    label: string;
    value: string;
}

export function StatRow(props: StatRowProps) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="baseline">
            <Typography variant="body2" color="text.secondary">
                {props.label}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
                {props.value}
            </Typography>
        </Stack>
    )
}

export interface HeroStatProps {
    label: string;
    value: string;
    unit?: string;
    // Matches ChartCard's dimension1/dimension2 color treatment (text-primary-700 / text-accent-700).
    color?: "primary" | "accent";
}

const HERO_COLOR_VAR: Record<string, string> = {
    primary: "var(--primary-700)",
    accent: "var(--accent-700)",
}

export function HeroStat(props: HeroStatProps) {
    return (
        <Box sx={{ textAlign: "center" }}>
            <Typography
                variant="h4"
                fontWeight={700}
                component="span"
                sx={{ color: HERO_COLOR_VAR[props.color ?? "primary"] }}
            >
                {props.value}
            </Typography>
            {props.unit && (
                <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 0.5 }}>
                    {props.unit}
                </Typography>
            )}
            <Typography variant="caption" color="text.secondary" display="block">
                {props.label}
            </Typography>
        </Box>
    )
}
