'use client'

import React from "react"
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import { AxisDomain } from "recharts/types/util/types"
import {
    __primary_600,
    __accent_400,
    __font_family,
} from "../../../globals"
import { mmToInches } from "../units"

// FAO reference daily ET0 realistically tops out well under 0.4in even in hot, arid conditions -
// fixing the axis here (instead of scaling it to the visible days' min/max like the rest of the app's
// charts do) is deliberate: a low-ET0 day would otherwise stretch to fill the axis and *look* just as
// tall as a high-ET0 day, which defeats the point of glancing at bar height to gauge "high vs low."
const ET0_DOMAIN: AxisDomain = [0, 0.4]

const formatTick = (value: string | number | Date) => {
    const d = new Date(value)
    return d
        .toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", hour12: true })
        .replace(" ", " · ")
}

function temperatureDomain(data: { [key: string]: any }[]): AxisDomain {
    const values = data.map((row) => Number(row.TEMPERATURE)).filter((v) => !Number.isNaN(v))
    if (values.length === 0) return [0, 100]

    const min = Math.min(...values)
    const max = Math.max(...values)
    return [Math.floor(min - 5), Math.ceil(max + 5)]
}

export interface ForecastChartProps {
    data: { [key: string]: any }[];
    detailed?: boolean;
}

export default function ForecastChart(props: ForecastChartProps) {
    if (!props.data || props.data.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-neutral-500">
                <span>No data available</span>
            </div>
        )
    }

    const data = props.data.map((row) => ({
        ...row,
        EVAPOTRANSPIRATION_IN: mmToInches(Number(row.EVAPOTRANSPIRATION)),
    }))

    const detailed = !!props.detailed

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 4, left: 4, right: 4, bottom: 4 }} data={data}>
                <Bar yAxisId="et0" dataKey="EVAPOTRANSPIRATION_IN" fill={__accent_400} radius={[2, 2, 0, 0]} barSize={detailed ? 16 : 6} />
                <Line yAxisId="temp" type="basis" dataKey="TEMPERATURE" stroke={__primary_600} strokeWidth={3} dot={false} />

                <YAxis yAxisId="temp" hide domain={temperatureDomain(data)} />
                <YAxis yAxisId="et0" hide domain={ET0_DOMAIN} orientation="right" />

                {detailed && (
                    <>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatTick}
                            angle={-30}
                            textAnchor="end"
                            height={56}
                            fontSize={12}
                            fontFamily={__font_family}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) =>
                                name === "EVAPOTRANSPIRATION_IN" ? [`${value} in`, "Transpiration"] : [`${value}°F`, "Temperature"]
                            }
                            labelFormatter={formatTick}
                        />
                    </>
                )}
            </ComposedChart>
        </ResponsiveContainer>
    )
}
