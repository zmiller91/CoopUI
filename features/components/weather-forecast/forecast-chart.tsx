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
    Legend,
    ReferenceLine,
    ResponsiveContainer,
} from "recharts"
import { AxisDomain } from "recharts/types/util/types"
import {
    __primary_600,
    __accent_400,
    __neutral_400,
    __font_family,
} from "../../../globals"

// This is the hourly ET0 rate (mm/hr, from Open-Meteo's FAO Penman-Monteith field), not a daily
// total - it peaks around solar noon and is ~0 overnight. Most climates top out well under 1mm/hr
// even at peak sun; fixing the axis here (instead of scaling it to the visible days' min/max like the
// rest of the app's charts do) is deliberate: a low-ET0 hour would otherwise stretch to fill the axis
// and *look* just as tall as a high-ET0 hour, which defeats the point of glancing at bar height to
// gauge "high vs low."
const ET0_DOMAIN: AxisDomain = [0, 1.2]

const formatTick = (value: string | number | Date) => {
    const d = new Date(value)
    return d
        .toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", hour12: true })
        .replace(" ", " · ")
}

function temperatureValues(data: { [key: string]: any }[]): number[] {
    return data.map((row) => Number(row.TEMPERATURE)).filter((v) => !Number.isNaN(v))
}

// Preview (dashboard tile) is too narrow for a wide fixed range to read well, so it keeps floating
// with the visible days' min/max - unlike ET0, a line's shape is still readable even as the axis
// rescales day to day.
function previewTemperatureDomain(data: { [key: string]: any }[]): [number, number] {
    const values = temperatureValues(data)
    if (values.length === 0) return [0, 100]

    const min = Math.min(...values)
    const max = Math.max(...values)
    return [Math.floor(min - 5), Math.ceil(max + 5)]
}

// Detailed (full history) view has room for a fixed reference range: [0, 110]°F normally, widening
// via min/max ±5 only on days that actually go outside it, rather than clipping.
function detailedTemperatureDomain(data: { [key: string]: any }[]): [number, number] {
    const values = temperatureValues(data)
    if (values.length === 0) return [0, 110]

    const min = Math.min(...values)
    const max = Math.max(...values)
    return [Math.min(0, Math.floor(min - 5)), Math.max(110, Math.ceil(max + 5))]
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

    const data = props.data
    const detailed = !!props.detailed
    const tempDomain = detailed ? detailedTemperatureDomain(data) : previewTemperatureDomain(data)

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: detailed ? 8 : 4, left: 4, right: 4, bottom: 4 }} data={data}>
                <Bar
                    yAxisId="et0"
                    dataKey="EVAPOTRANSPIRATION"
                    name="Transpiration (mm/hr)"
                    fill={__accent_400}
                    radius={[2, 2, 0, 0]}
                    barSize={detailed ? 16 : 6}
                />
                <Line
                    yAxisId="temp"
                    type="basis"
                    dataKey="TEMPERATURE"
                    name="Temperature (°F)"
                    stroke={__primary_600}
                    strokeWidth={3}
                    dot={false}
                />

                {detailed && tempDomain[0] < 0 && (
                    <ReferenceLine yAxisId="temp" y={0} stroke={__neutral_400} strokeDasharray="3 3" />
                )}

                <YAxis
                    yAxisId="temp"
                    hide={!detailed}
                    domain={tempDomain}
                    tickFormatter={(v) => `${Math.round(v)}°`}
                    stroke={__primary_600}
                    fontSize={11}
                    fontFamily={__font_family}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                />
                <YAxis
                    yAxisId="et0"
                    hide={!detailed}
                    domain={ET0_DOMAIN}
                    orientation="right"
                    tickFormatter={(v) => `${v}mm`}
                    stroke={__accent_400}
                    fontSize={11}
                    fontFamily={__font_family}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                />

                {detailed && (
                    <>
                        <CartesianGrid vertical={false} />
                        <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: 12, fontFamily: __font_family }} />
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
                                name.startsWith("Temperature") ? [Math.round(value), name] : [value, name]
                            }
                            labelFormatter={formatTick}
                        />
                    </>
                )}
            </ComposedChart>
        </ResponsiveContainer>
    )
}
