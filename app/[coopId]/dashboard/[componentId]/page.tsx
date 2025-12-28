'use client'

import React, {useState, useEffect} from "react";
import Tabs from "../../../../components/tabs";
import { AppContent } from "../../../../components/app-content";
import { StatusInfo } from "../status-info";
import Chart from "../chart";
import data, { ComponentData, MetricInterval } from "../../../../client/data"
import { currentCoop } from "../../coop-context";
import { currentComponent } from "./component-context";
import {ChartConfig, DataDimension, CHART_CONFIG} from "../../../../utils/chart-config";
import {Card} from "../../../../components/card";

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

    function convertDimension(datum: number, dimension: DataDimension)  {
        if(dimension.formatter) {
            return dimension.formatter(datum)
        }

        return datum
    }

    function convertComponentData() {

        const props = CHART_CONFIG[componentData.componentType];
        const converted = [];
        for(let i in componentData.data ) {
            const copy = JSON.parse(JSON.stringify(componentData.data[i]));

            if(props.dimension1) {
                copy[props.dimension1.key] = convertDimension(copy[props.dimension1.key], props.dimension1)
            }

            if(props.dimension2) {
                copy[props.dimension2.key] = convertDimension(copy[props.dimension2.key], props.dimension2)
            }

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

    function getLastCheckIn() {
        // Data sent over in milliseconds, turn it into minutes
        return Math.round((Date.now() - componentData.lastUpdate) / 1000 / 60);
    }

    function getRecent(dimension: DataDimension) {
        if(dimension.formatter) {
            return dimension.formatter(getMostRecentData()[dimension.key])
        }

        return getMostRecentData()[dimension.key];
    }

    return (
        <div>
            <AppContent>
                <div className="space-y-4">
                    <Card>
                        <StatusInfo lastCheckin={getLastCheckIn()}/>
                    </Card>


                    <div className={"grid gap-3 " + (CHART_CONFIG[componentData.componentType]?.dimension2 ? "grid-cols-2" : "grid-cols-1")}>

                        {CHART_CONFIG[componentData.componentType]?.dimension1 &&
                            <Card>
                                <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
                                    <span className="inline-block w-2 h-2 rounded-full bg-primary-600" />
                                    {CHART_CONFIG[componentData.componentType].dimension1.name ?? "Metric"}
                                </div>
                                <div className="mt-1 flex items-baseline gap-1">
                                    <div className="text-4xl font-semibold text-neutral-900 tabular-nums">
                                        {getRecent(CHART_CONFIG[componentData.componentType].dimension1)}
                                    </div>
                                    <div className="text-sm text-neutral-600 font-medium">
                                        {CHART_CONFIG[componentData.componentType].dimension1.label}
                                    </div>
                                </div>
                            </Card>
                        }

                        {CHART_CONFIG[componentData.componentType]?.dimension2 &&
                            <Card>
                                <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
                                    <span className="inline-block w-2 h-2 rounded-full bg-secondary-600" />
                                    {CHART_CONFIG[componentData.componentType].dimension1.name ?? "Metric"}
                                </div>
                                <div className="mt-1 flex items-baseline gap-1">
                                    <div className="text-4xl font-semibold text-neutral-900 tabular-nums">
                                        {getRecent(CHART_CONFIG[componentData.componentType].dimension2)}
                                    </div>
                                    <div className="text-sm text-neutral-600 font-medium">
                                        {CHART_CONFIG[componentData.componentType].dimension2.label}
                                    </div>
                                </div>
                            </Card>
                        }

                    </div>
                    <Card>
                        <Tabs tabs={[MetricInterval.DAY, MetricInterval.WEEK, MetricInterval.MONTH, MetricInterval.YEAR]} onChange={switchTab}/>
                        <div className="pt-4 h-[250px]">
                            <Chart detailed={true} data={convertComponentData()}
                                   dataKey={CHART_CONFIG[componentData.componentType]?.dimension1.key}
                                   dataKey2={CHART_CONFIG[componentData.componentType]?.dimension2?.key} />
                        </div>
                    </Card>
                </div>
            </AppContent>
        </div>
    )
}

export interface ComponentDashboardProps {
//     initialData: ComponentData;
}