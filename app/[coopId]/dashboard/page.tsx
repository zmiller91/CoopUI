"use client"


import React, {useState, useEffect} from "react";
import Chart from "./chart";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faDoorClosed, faDoorOpen } from '@fortawesome/free-solid-svg-icons'
import {__accent_200, __accent_600} from "../../../globals"
import data, { Datapoint } from "../../../client/data"
import {currentCoop} from "../coop-context"



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

}, [])
  


  return (

    <div className="w-full h-full p-4">
      
      <ChartArea data={tempData}/>

      {/* <div className="grid gap-4 grid-cols-[70%_30%] mt-8 ml-4 mr-4 h-[500px] pb-5">

        <div className="h-full dashboard-section">

            <div className="ml-20 pt-4 pb-4">
              <div className="neutral-text-700 float-right mr-8">1H 1D 1W 1M 1Y ALL</div>
              <div className="neutral-text-700">Temperature</div>
              <div className="text-4xl primary-text-700">76&deg;</div>
            </div>

            <div className="h-[300px]">
              <Chart detailed={true} data={foodData}/>
            </div>
            
            <div className="h-[50px]">
              <div className="grid grid-cols-3 gap-4 h-full pl-8 pr-8 pt-4">

                <div className="grid grid-cols-[25%_75%] h-full border-r-2">
                  <div>
                    <div className="neutral-text-700">
                        Humidity
                    </div>
                    <div className="text-xl primary-text-700">
                        40%
                    </div>
                  </div>
                  <div className="h-full">
                    <Chart data={humidityData}/>
                  </div>
                </div>

                <div className="grid grid-cols-[25%_75%] h-full border-r-2">
                  <div>
                    <div className="neutral-text-700">
                        Water
                    </div>
                    <div className="text-xl primary-text-700">
                        90%
                    </div>
                  </div>
                  <div className="h-full">
                    <Chart data={waterData}/>
                  </div>
                </div>

                <div className="grid grid-cols-[25%_75%] h-full">
                  <div>
                    <div className="neutral-text-700">
                        Food
                    </div>
                    <div className="text-xl primary-text-700">
                        13 lbs.
                    </div>
                  </div>
                  <div className="h-full">
                    <Chart data={foodData}/>
                  </div>
                </div>

              </div>
            </div>
        </div>


        
        <div className="h-full dashboard-section mr-4">

          <div className="m-8">
            <span className="text-lg font-bold neutral-text-700">Activity Log</span>
            <span className="float-right">

              <span className="mr-2 font-bold accent-text-700">Online</span>
              <span className="fa-layers fa-fw">
                <FontAwesomeIcon icon={faCircle} style={{color: __accent_200,}} size="lg"/>
                <FontAwesomeIcon icon={faCircle} style={{color: __accent_600,}} size="xs" />

              </span>
            </span>
          </div>

          <div>




            <div className="mt-2 mb-8 ml-8 mr-8">
              <div className="ml-2 mr-2 mb-2 border-t-2"></div>
              <div>
                <div>
                  <span className="primary-text-700 h-full flex flex-row items-center">
                    <span className="mr-2">
                      <FontAwesomeIcon icon={faDoorClosed} style={{color: __accent_200,}} size="2x"/>
                    </span>
                    Door closed
                  </span>
                </div>
                <div className="float-right neutral-text-500 text-sm">
                  Oct 11 @ 7:15 AM
                </div>
              </div>
            </div>

            <div className="mt-2 mb-2 ml-8 mr-8">
              <div className="ml-2 mr-2 mb-2 border-t-2"></div>
              <div>
                <div>
                  <span className="primary-text-700 h-full flex flex-row items-center">
                    <span className="mr-2">
                      <FontAwesomeIcon icon={faDoorClosed} style={{color: __accent_200,}} size="2x"/>
                    </span>
                    Door closed
                  </span>
                </div>
                <div className="float-right neutral-text-500 text-sm">
                  Oct 11 @ 7:15 AM
                </div>
              </div>
            </div>





          </div>



        </div>

      </div> */}

    </div>
      
  );
  
}
