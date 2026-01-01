import {ComponentData} from "../../client/data";
import {useRouter} from "next/navigation";
import {Card, CardTitle} from "../card";
import {StatusInfo} from "../../app/[coopId]/dashboard/status-info";
import Chart from "../../app/[coopId]/dashboard/chart";
import React from "react";
import {DataDimension} from "../../utils/chart-config";

export interface ChartCardProps {
    name:string
    type:string;
    data: ComponentData;
    dimension1?: DataDimension,
    dimension2?: DataDimension
}

export default function ChartCard(props:ChartCardProps) {

    const router = useRouter();

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

    function goToDetail() {
        router.push("./dashboard/" + props.data.componentId);
    }

    function getLastCheckIn() {
        // Data sent over in milliseconds, turn it into minutes
        return Math.round((Date.now() - props.data.lastUpdate) / 1000 / 60);
    }

    return (
        <Card onClick={goToDetail} className="mb-2">
            <div className="grid grid-cols-2">
                <CardTitle title={props.name} subtitle={props.type}/>
                <StatusInfo lastCheckin={getLastCheckIn()} preview={true} className="justify-self-end"/>
            </div>

            <div className="text-5xl mb-4">

                <div className="grid grid-cols-2 pt-4 pb-4 pr-2 pl-2">
                    {props.dimension1 &&
                        <div className="justify-self-end pr-5">
                            <span className="text-5xl font-semibold tracking-tight text-primary-700">
                                {props.dimension1.formatter ?
                                    props.dimension1.formatter(getMostRecentData()[props.dimension1.key]) :
                                    getMostRecentData()[props.dimension1.key]
                                }
                            </span>
                            <sup className="text-xl ml-1 text-neutral-500">{props.dimension1.label}</sup>
                        </div>
                    }

                    { props.dimension2 &&
                        <div className="justify-self-end pr-5">
                            <span className="text-5xl font-semibold tracking-tight text-accent-700">
                                {props.dimension2.formatter ?
                                    props.dimension2.formatter(getMostRecentData()[props.dimension2.key]) :
                                    getMostRecentData()[props.dimension2.key]
                                }
                            </span>
                            <sup className="text-xl ml-1 text-neutral-500">{props.dimension2.label}</sup>
                        </div>
                    }
                </div>

            </div>


            <div className="h-[75px]">
                <Chart detailed={false}
                       data={props.data.data}
                       dataKey={props.dimension1?.key}
                       dataKey2={props.dimension2?.key}/>
            </div>
        </Card>
    )
}