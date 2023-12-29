"use client"

import React from "react";
import Chart from "./chart";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faDoorClosed, faDoorOpen } from '@fortawesome/free-solid-svg-icons'
import {__accent_200, __accent_600} from "../../../globals"

export default class Dashboard  extends React.Component {
  static demoUrl = 'https://codesandbox.io/s/simple-line-chart-kec3v';



  render() {
    return (

      <div className="w-full h-full">

        <div className="pl-4 pt-8 pb-8">
          <span className="text-4xl font-bold primary-text-100">Dashboard</span>
        </div>


        <div className="grid gap-4 pl-4 pr-4 grid-cols-4 w-full h-[125px]">

          <div className="w-full h-full dashboard-section">
          </div>
          
          <div className="w-full h-full dashboard-section">
          </div>
          
          <div className="w-full h-full dashboard-section">
          </div>
          
          <div className="w-full h-full dashboard-section">
          </div>

        </div>
        
        <div className="grid gap-4 grid-cols-[70%_30%] mt-8 ml-4 mr-4 h-[500px] pb-5">

          <div className="h-full dashboard-section">

              <div className="ml-20 pt-4 pb-4">
                <div className="neutral-text-700 float-right mr-8">1H 1D 1W 1M 1Y ALL</div>
                <div className="neutral-text-700">Temperature</div>
                <div className="text-4xl primary-text-700">76&deg;</div>
              </div>

              <div className="h-[300px]">
                <Chart detailed={true}/>
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
                      <Chart />
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
                      <Chart />
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
                      <Chart />
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

        </div>

      </div>
        
    );
  }
}
