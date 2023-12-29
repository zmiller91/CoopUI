'use client'

import React from "react";
import CoopSelection from "../components/sidenav/coop-selection"
import SideBarTab from "../components/sidenav/tab"
import { href } from "../utils/path"
import { useParams, useSearchParams  } from 'next/navigation'

export default function SideBar() {

    const params = useParams()

    function location(page:string) {
        return "/" + params["coopId"] + "/" + page;
    }

    return (
        <div className="ml-2 relative h-full dashboard-section">
            <div>
                <div className="ml-[5%] mr-[5%] border-b-2 mb-5">
                    <ul className="mb-5 mt-5">
                        <li>
                            <CoopSelection/>
                        </li>
                    </ul>
                </div>
                <ul>
                    <li>
                        <SideBarTab title="Dashboard" location={location("dashboard")}/>
                    </li>
                    <li>
                        <SideBarTab title="Components" location={location("components")}/>
                    </li>
                    <li>
                        <SideBarTab title="Settings" location={location("settings")}/>
                    </li>
                </ul>
            </div>

            <div className="absolute bottom-1 w-full">
                <div className="ml-[5%] mr-[5%] border-t-2"></div>
                <ul className="pt-5 pb-5">
                    <li>
                        <SideBarTab title="Signout" location="/logout" />
                    </li>
                </ul>
            </div>
        </div>
    );

}
