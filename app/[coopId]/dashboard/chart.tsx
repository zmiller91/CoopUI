"use client"

import React  from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import {
  __primary_500,
  __primary_200,
  __accent_700,
  __accent_300,
  __font_family,
  __primary_600,
  __accent_600
} from "../../../globals"
import {AxisDomain} from "recharts/types/util/types";

function NoDataChart() {
  return (
    <div className="w-full h-full flex items-center justify-center text-neutral-500">
      <span>No data available</span>
    </div>
  )
}
const formatTick = (value: string | number | Date) => {
  const d = new Date(value);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    hour12: true
  }).replace(" ", " · ");
};


function DetailedChart(props:DetailedChartProps) {

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart margin={{ top: 4, left: 4, right: 4, bottom: 4 }} data={props.data}>

        <Line yAxisId="right" type="basis" dataKey={props.dataKey} stroke={__primary_600} strokeWidth="3" dot={false} />
        {props.dataKey2 && <Line yAxisId="left" type="basis" dataKey={props.dataKey2} stroke={__accent_600} strokeWidth="3"  dot={false} />}

        <YAxis hide yAxisId="right" textAnchor='end' axisLine={false} tickLine={false} fontSize="12" fontFamily={__font_family} domain={[0,100]}/>
        { props.dataKey2 && <YAxis hide yAxisId="left" orientation="right" textAnchor='start' axisLine={false} tickLine={false} fontSize="12" fontFamily={__font_family} domain={[0,100]}/>}
        
        <CartesianGrid vertical={false}/>
        <XAxis dataKey="date"
               tickFormatter={formatTick}
               angle={-30}
               textAnchor="end"
               height={56}
               fontSize={12}
               fontFamily={__font_family}
        />
        <Tooltip />

      </LineChart>
    </ResponsiveContainer>
  );
}

interface DetailedChartProps {
  data:{[key:string]:any}[];
  dataKey:string;
  dataKey2?:string;
}

function previewAxisDomain(dataKey: string, data: {[key:string]:any}[]): AxisDomain {
  if(!data) {
    return [0, 100]
  }

  const max = data.reduce((acc, row) => Math.max(acc, Number(row[dataKey])), -Infinity);
  const min = data.reduce((acc, row) => Math.min(acc, Number(row[dataKey])), Infinity);

  return [min * 0.9, max * 1.1];
}

function PreviewChart(props:PreviewChartProps) {

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart margin={{ top: 4, left: 4, right: 4, bottom: 4 }} data={props.data}>
        <Line yAxisId="right" type="basis" dataKey={props.dataKey} stroke={__primary_600} dot={false} strokeWidth="3" />
        {props.dataKey2 && <Line yAxisId="left" type="basis" dataKey={props.dataKey2} stroke={__accent_600} dot={false}  strokeWidth="3" />}

        <YAxis  yAxisId="right"
                textAnchor='start'
                tick={false}
                axisLine={false}
                tickLine={false}
                fontSize="12"
                fontFamily={__font_family}
                hide
                width={0}
                domain={previewAxisDomain(props.dataKey, props.data)}/>

        {props.dataKey2 &&
            <YAxis  yAxisId="left"
                    textAnchor='start'
                    tick={false}
                    axisLine={false}
                    tickLine={false}
                    fontSize="12"
                    fontFamily={__font_family}
                    hide
                    width={0}
                    domain={previewAxisDomain(props.dataKey2, props.data)}/>}
      </LineChart>
    </ResponsiveContainer>
  )
}

interface PreviewChartProps {
  data:{[key:string]:any}[];
  dataKey:string;
  dataKey2?:string;
}

function DataChart(props:ChartProps) {
  return (
    <div className="h-full">
      {props.detailed ? <DetailedChart data={props.data} dataKey={props.dataKey} dataKey2={props.dataKey2}/> :
                        <PreviewChart data={props.data} dataKey={props.dataKey} dataKey2={props.dataKey2}/>}
    </div>
  );
}

export default function Chart(props:ChartProps) {
  return (
    <div className="h-full">
        {props.data && props.data.length > 0 && <DataChart detailed={props.detailed} data={props.data} dataKey={props.dataKey} dataKey2={props.dataKey2}/>}
        {(!props.data || props.data.length == 0) && <NoDataChart/>}
    </div>
  );
}

export interface ChartProps {
  detailed:Boolean;
  data:{[key:string]:any}[];
  dataKey:string;
  dataKey2?:string;
}