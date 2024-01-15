"use client"

import React, {useState, useEffect, ReactNode, Children} from "react";
import Chart from "./chart";
import { StatusInfo, Status } from "./status-info";
import {__accent_200, __accent_600} from "../../../globals"
import data, { ComponentData } from "../../../client/data"
import {currentCoop} from "../coop-context"
import { AppContent } from "../../../components/app-content";
import { Card, CardTitle } from "../../../components/card";
import { useRouter, usePathname } from 'next/navigation'

function WeatherSensorCard(props:WeatherSensorCardProps) {


  const router = useRouter();
  const path = usePathname();

  function latest(metric:string) {
      if(!props.data.data) {
        return "N/A"
      }

      for(var i = props.data.data.length - 1; i >= 0; i--) {
        const dataPoint = props.data.data[i];
        if(dataPoint[metric]) {
          return dataPoint[metric];
        }
      }

      return "N/A";
  }

  function goToDetail() {
    router.push("./dashboard/" + props.data.componentId);
  }

  return (
    <Card onClick={goToDetail}>
      <div className="grid grid-cols-2">
        <CardTitle title={props.title}/>
        <StatusInfo lastCheckin={props.lastCheckin} className="justify-self-end"/>
      </div>


      <div className="text-5xl mb-4">

        <div className="grid grid-cols-2 pt-4 pb-4 pr-2 pl-2">
            <div className="text-5xl justify-self-end pr-5">
              {latest("TEMPERATURE")}<sup className="text-2xl">&#8457;</sup>
            </div>
            <div className="text-5xl pl-5">
            {latest("HUMIDITY")}<sup className="text-2xl">%RH</sup>
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
  title:string;
  lastCheckin:number;
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
          <WeatherSensorCard key={d.componentId} title="Weather Sensor" lastCheckin={5} data={d}/>
        )
      })}

    </AppContent>
  );
  
}
