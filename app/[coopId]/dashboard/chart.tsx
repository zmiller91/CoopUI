"use client"

import React  from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import {__primary_800, __primary_200, __accent_800, __accent_200, __font_family} from "../../../globals"
import { Datapoint } from '../../../client/data';

function NoDataChart() {
  return (
    <div className="w-full h-full flex items-center justify-center text-neutral-500">
      <span>No data available</span>
    </div>
  )
}

function DetailedChart(props:DetailedChartProps) {

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart margin={{ top: 0, left: -30, right: -30, bottom: 0 }} data={props.data}>

        <Line yAxisId="right" type="basis" dataKey={props.dataKey} stroke={__accent_800} strokeWidth="3" dot={false} />
        {props.dataKey2 && <Line yAxisId="left" type="basis" dataKey={props.dataKey2} stroke={__accent_800} strokeWidth="3"  dot={false} />}

        <YAxis yAxisId="left" textAnchor='end' axisLine={false} tickLine={false} fontSize="12" fontFamily={__font_family} domain={[0,100]}/>
        { props.dataKey2 && <YAxis yAxisId="right" orientation="right" textAnchor='start' axisLine={false} tickLine={false} fontSize="12" fontFamily={__font_family} domain={[0,100]}/>}
        
        <CartesianGrid vertical={false}/>
        <XAxis dataKey="date" textAnchor='end' axisLine={false} fontSize="12" fontFamily={__font_family}/>
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

function PreviewChart(props:PreviewChartProps) {

  console.log(props.data);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart margin={{ top: 0, left: -115, right: 5, bottom: 0 }} data={props.data}>
        <Line yAxisId="right" type="basis" dataKey={props.dataKey} stroke={__accent_800} dot={false}/>
        {props.dataKey2 && <Line yAxisId="left" type="basis" dataKey={props.dataKey2} stroke={__accent_800} dot={false} />}
        <YAxis  yAxisId="left" textAnchor='start' tick={false} axisLine={false} tickLine={false} fontSize="12" fontFamily={__font_family} domain={[0,100]}/>
        {props.dataKey2 && <YAxis  yAxisId="right" textAnchor='start' tick={false} axisLine={false} tickLine={false} fontSize="12" fontFamily={__font_family} domain={[0,100]}/>}
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