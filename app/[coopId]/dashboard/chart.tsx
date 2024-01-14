"use client"

import React  from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {__primary_800, __primary_200, __font_family} from "../../../globals"
import { Datapoint } from '../../../client/data';

function NoDataChart() {
  return (
    <div className="w-full h-full flex items-center justify-center text-neutral-500">
      <span>No data available</span>
    </div>
  )
}

function DataChart(props:ChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart margin={{ top: 0, left: -50, right: 5, bottom: 0 }} data={props.data}>

      <Area type="monotone" dataKey="value" stroke={__primary_800} fill={__primary_200} />
        { props.detailed && <CartesianGrid vertical={false}/>}
        { props.detailed && <XAxis dataKey="date" angle={-45} textAnchor='middle' axisLine={false} fontSize="12" fontFamily={__font_family}/>}
        { props.detailed && <YAxis textAnchor='start' axisLine={false} tickLine={false} fontSize="12" fontFamily={__font_family}/>}
        { props.detailed && <Tooltip />}
        <YAxis textAnchor='start' tick={false} axisLine={false} tickLine={false} fontSize="12" fontFamily={__font_family} domain={[60,72]}/>
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function Chart(props:ChartProps) {
  return (
    <div className="h-full">
        {props.data.length > 0 && <DataChart detailed={props.detailed} data={props.data}/>}
        {props.data.length == 0 && <NoDataChart/>}
    </div>
  );
}

export interface ChartProps {
  detailed:Boolean;
  data:Datapoint[];
}