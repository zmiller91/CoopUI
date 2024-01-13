"use client"


import React, {useState, useEffect} from "react";
import Chart from "./chart";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faDoorClosed, faDoorOpen } from '@fortawesome/free-solid-svg-icons'
import {__accent_200, __accent_600} from "../../../globals"
import data, { Datapoint } from "../../../client/data"
import {currentCoop} from "../coop-context"
import { AppContent } from "../../../components/app-content";


function ChartTab(props:ChartTabProps) {

  return (
    <div className={"text-center p-1 " + props.className}>
      <div className="text-xs">{props.label}</div>
      <div className="text-2xl">{props.value}</div>
    </div>
  )

}

interface ChartTabProps{
  label:string;
  value:string;
  className?:string;
}



function ChartArea(props:ChartAreaProps) {


  return (
    <div>
      <div className="grid grid-cols-4 gap-0 mb-4">

        <ChartTab label="Temperature" value="100&#8457;" className="border-l-2"/>
        <ChartTab label="Humidity" value="100%" className="border-l-2"/>
        <ChartTab label="Food" value="100 lb." className="border-l-2"/>
        <ChartTab label="Water" value="100%" className="border-l-2 border-r-2"/>

      </div>
      <div className="h-[250px]">
        <Chart detailed={true} data={props.data}/>
      </div>
    </div>
  )

}


interface ChartAreaProps {
  data: Datapoint[]
}


export default function Dashboard(){

  const [tempData, setTempData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [foodData, setFoodData] = useState([]);
  const [waterData, setWaterData] = useState([]);

  const coopId = currentCoop();

  useEffect(() => {
    
    data.getData(coopId, "temperature", setTempData)
    data.getData(coopId, "humidity", setHumidityData)
    data.getData(coopId, "food", setFoodData)
    data.getData(coopId, "water", setWaterData)

}, []);

  return (
      <AppContent>
        <ChartArea data={humidityData}/>
      </AppContent>
      
  );
  
}
