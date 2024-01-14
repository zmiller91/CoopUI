"use client"

import React, {useState, useEffect, ReactNode, Children} from "react";
import Chart from "./chart";
import { StatusInfo, Status } from "./status-info";
import {__accent_200, __accent_600} from "../../../globals"
import data, { Datapoint } from "../../../client/data"
import {currentCoop} from "../coop-context"
import { AppContent } from "../../../components/app-content";
import { Card, CardTitle } from "./card";

function DashCard(props:DashCardProps) {

  return (
    <Card>
      <div className="grid grid-cols-2">

        <div>
          <CardTitle title={props.title}/>
          <div className="text-5xl mb-4">
            {props.children}
          </div>
        </div>
        
        <StatusInfo lastCheckin={props.lastCheckin} className="justify-self-end"/>
      </div>

      <div className="h-[75px]">
        <Chart detailed={false} data={props.data}/>
      </div>
    </Card>
  )
}

interface DashCardProps {
  title:string;
  lastCheckin:number;
  data: Datapoint[];
  children:ReactNode;
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
    <AppContent className="background-neutral-200">


      <DashCard title="Temperature" lastCheckin={5} data={tempData}>
        5&#8457;
      </DashCard>

      <DashCard title="Humidity" lastCheckin={10080} data={humidityData}>
        <span className="text-neutral-500">N/A</span>
      </DashCard>

    </AppContent>
  );
  
}
