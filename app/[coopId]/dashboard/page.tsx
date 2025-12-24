"use client"

import React, {useState, useEffect} from "react";
import data from "../../../client/data"
import {currentCoop} from "../coop-context"
import { AppContent } from "../../../components/app-content";
import SensorCard from "../../../components/dashboard/chart-card";
import {CHART_CONFIG} from "../../../utils/chart-config";

export default function Dashboard(){

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


      {coopData.filter(d => CHART_CONFIG[d.componentType]).map(d => {
        return (
          <SensorCard key={d.componentId}
                      name={d.componentName}
                      type={d.componentTypeDescription}
                      data={d}
                      dimension1={CHART_CONFIG[d.componentType].dimension1}
                      dimension2={CHART_CONFIG[d.componentType].dimension2}/>
        )
      })}

    </AppContent>
  );
  
}
