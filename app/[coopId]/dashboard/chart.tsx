"use client"

import React  from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {__primary_800, __primary_200} from "../../../globals"
import { Datapoint } from '../../../client/data';

export default function Chart(props:ChartProps) {

  return (

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart margin={{ top: 0, left: -50, right: 5, bottom: 0 }} data={props.data}>

          <Area type="monotone" dataKey="value" stroke={__primary_800} fill={__primary_200} />
            { props.detailed && <CartesianGrid strokeDasharray="3 3" />}
            { props.detailed && <XAxis dataKey="date" angle={-45} textAnchor='middle' axisLine={false}/>}
            { props.detailed && <YAxis textAnchor='start' axisLine={false} tickLine={false}/>}
            { props.detailed && <Tooltip />}
            
          </AreaChart>
        </ResponsiveContainer>
    );
  }


export interface ChartProps {
  detailed:Boolean;
  data:Datapoint[];
}