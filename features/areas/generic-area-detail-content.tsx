'use client'

import React from "react"
import { useRouter } from "next/navigation"
import ChartCard from "../../components/dashboard/chart-card"
import SectionPaper from "../../components/section-paper"
import { AreaDetailContentProps } from "./registry"
import { ComponentData } from "../../client/data"
import { CHART_CONFIG } from "../../utils/chart-config"

import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"

export default function GenericAreaDetailContent(props: AreaDetailContentProps) {
    const router = useRouter()

    if (props.members.length === 0) {
        return (
            <SectionPaper sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                    No devices in this group yet.
                </Typography>
                <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => router.push(`/${props.coopId}/areas/${props.area.id}/edit`)}
                >
                    Add Devices
                </Button>
            </SectionPaper>
        )
    }

    return (
        <Grid container spacing={2} sx={{ width: "100%" }}>
            {props.members.map((d: ComponentData) => (
                <Grid key={d.componentId} size={{ xs: 12, md: 6, lg: 4 }}>
                    <ChartCard
                        name={d.componentName}
                        type={d.componentTypeDescription}
                        data={d}
                        dimension1={CHART_CONFIG[d.componentType].dimension1}
                        dimension2={CHART_CONFIG[d.componentType].dimension2}
                        href={`/${props.coopId}/dashboard/${d.componentId}`}
                    />
                </Grid>
            ))}
        </Grid>
    )
}
