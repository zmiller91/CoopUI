'use client'

import React, {useState, useEffect} from "react";
import Tabs from "../../../../components/tabs";
import { AppContent } from "../../../../components/app-content";
import { StatusInfo } from "../status-info";
import Chart from "../chart";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBatteryFull, faBatteryThreeQuarters, faBatteryHalf, faBatteryQuarter, faBatteryEmpty} from '@fortawesome/free-solid-svg-icons'
import data, { ComponentData, MetricInterval } from "../../../../client/data"
import { currentCoop } from "../../coop-context";
import { currentComponent } from "./component-context";

function BatteryLevel(props:BatteryLevelProps) {

    if(props.level > 87) {
        return <FontAwesomeIcon icon={faBatteryFull} className="h-[24px] text-neutral-700"/>;
    }

    if(props.level > 62) {
        return <FontAwesomeIcon icon={faBatteryThreeQuarters} className="h-[24px] text-neutral-700"/>
    }

    if(props.level > 37) {
        return <FontAwesomeIcon icon={faBatteryHalf} className="h-[24px] text-neutral-700"/>
    }

    if(props.level > 12) {
        return <FontAwesomeIcon icon={faBatteryQuarter} className="h-[24px] text-warn-500"/>
    }

    return <FontAwesomeIcon icon={faBatteryEmpty} className="h-[24px] text-error-500"/>

}

interface BatteryLevelProps {
    level:number;
}

export default function ComponentDashboard(props:ComponentDashboardProps) {
  
    const coopId = currentCoop();
    const componentId = currentComponent();
    const [componentData, setComponentData] = useState({} as ComponentData);
  
    useEffect(() => {
        data.getComponentData(coopId, componentId, MetricInterval.DAY, setComponentData);
    }, []);

    function switchTab(tab:string) {
        data.getComponentData(coopId, componentId, MetricInterval[tab], setComponentData);
    }

    function toFahrenheit(celsius) {
        return Math.round((celsius * 9/5) + 32);
    }

    function convertComponentData() {

        const converted = [];
        for(let i in componentData.data ) {
            const copy = JSON.parse(JSON.stringify(componentData.data[i]));
            copy["TEMPERATURE"] = toFahrenheit(copy["TEMPERATURE"]);
            converted.push(copy);
        }

        return converted;
    }

    function getMostRecentData() {
        var mostRecent = {};
        var idx = -1;
        for(let i in componentData.data ) {
            if(componentData.data[i].idx > idx) {
                idx = componentData.data[i].idx;
                mostRecent = componentData.data[i];
            }
        }

        return mostRecent;
    }

    function getBatteryLevel() {
        return componentData.batteryLevel;
    }

    function getLastCheckIn() {
        // Data sent over in milliseconds, turn it into minutes
        return Math.round((Date.now() - componentData.lastUpdate) / 1000 / 60);
    }

    function getRecentTemp() {
        return toFahrenheit(getMostRecentData()['TEMPERATURE']);
    }

    function getRecentHumidity() {
        return getMostRecentData()['HUMIDITY'];
    }

    return (
        <div>
            <AppContent>

                <div className="grid grid-cols-2">
                    <StatusInfo lastCheckin={getLastCheckIn()}/>
                    <div className="justify-self-end">
                        <BatteryLevel level={getBatteryLevel()}/>
                    </div>
                </div>

                <div className="grid grid-cols-2 pt-4 pb-4 pr-2 pl-2">
                    <div className="text-5xl justify-self-end pr-5">
                        {getRecentTemp()}<sup className="text-2xl">&#8457;</sup>
                    </div>
                    <div className="text-5xl pl-5">
                        {getRecentHumidity()}<sup className="text-2xl">%RH</sup>
                    </div>
                </div>

                <Tabs tabs={[MetricInterval.DAY, MetricInterval.WEEK, MetricInterval.MONTH, MetricInterval.YEAR]} onChange={switchTab}/>

                <div className="pt-4 h-[325px]">
                    <Chart detailed={true} data={convertComponentData()} dataKey="TEMPERATURE" dataKey2="HUMIDITY" />
                </div>
            </AppContent>
        </div>
    )
}

export interface ComponentDashboardProps {
//     initialData: ComponentData;
}