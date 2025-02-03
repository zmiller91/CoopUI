"use client"

import React, {useState, useEffect, ReactNode, Children} from "react";
import Chart from "./chart";
import { StatusInfo } from "./status-info";
import data, { ComponentData } from "../../../client/data"
import {currentCoop} from "../coop-context"
import { AppContent } from "../../../components/app-content";
import { Card, CardTitle } from "../../../components/card";
import { useRouter, usePathname } from 'next/navigation'

function WeatherSensorCard(props:WeatherSensorCardProps) {


  const router = useRouter();
  const path = usePathname();

    function getMostRecentData() {
        var mostRecent = {};
        var idx = -1;
        for(let i in props.data.data ) {
            if(props.data.data[i].idx > idx) {
                idx = props.data.data[i].idx;
                mostRecent = props.data.data[i];
            }
        }

        return mostRecent;
    }

    function toFahrenheit(celsius) {
        return Math.round((celsius * 9/5) + 32);
    }

    function goToDetail() {
        router.push("./dashboard/" + props.data.componentId);
    }

    function getLastCheckIn() {
        // Data sent over in milliseconds, turn it into minutes
        return Math.round((Date.now() - props.data.lastUpdate) / 1000 / 60);
    }

  return (
    <Card onClick={goToDetail}>
      <div className="grid grid-cols-2">
        <CardTitle title={props.name} subtitle={props.type}/>
        <StatusInfo lastCheckin={getLastCheckIn()} className="justify-self-end"/>
      </div>


      <div className="text-5xl mb-4">

        <div className="grid grid-cols-2 pt-4 pb-4 pr-2 pl-2">
            <div className="text-5xl justify-self-end pr-5">
              {toFahrenheit(getMostRecentData()["TEMPERATURE"])}<sup className="text-2xl">&#8457;</sup>
            </div>
            <div className="text-5xl pl-5">
            {getMostRecentData()["HUMIDITY"]}<sup className="text-2xl">%RH</sup>
            </div>
        </div>

      </div>


      <div className="h-[75px]">
        <Chart detailed={false} data={props.data.data} dataKey="TEMPERATURE" dataKey2="HUMIDITY"/>
      </div>
    </Card>
  )
}


interface WeatherSensorCardProps {
    name:string
    type:string;
    data: ComponentData;
}

export default function Dashboard(){

  const chartsToLoad = 4;
  var loadedCount = 0;

  const [coopData, setCoopData] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const coopId = currentCoop();

  useEffect(() => {
    data.getCoopData(coopId, (data) => {
      setCoopData(data);
      setHasLoaded(true);
    });
  
}, []);

  return (
    <AppContent hasLoaded={hasLoaded}>


      {coopData.map(d => {
        return (
          <WeatherSensorCard key={d.componentId} name={d.componentName} type={d.componentTypeDescription} data={d}/>
        )
      })}

    </AppContent>
  );
  
}
