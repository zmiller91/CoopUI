'use client'

import React from "react";
import CoopSelection from "../components/sidenav/coop-selection"
import SideBarTab from "../components/sidenav/tab"
import { href } from "../utils/path"
import { useSearchParams  } from 'next/navigation'

export default function SideBar() {

    const queryParams = useSearchParams()

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
                        <SideBarTab title="Dashboard" location={href("/dashboard", {id: queryParams.get("id")})}/>
                    </li>
                    <li>
                        <SideBarTab title="Schedules" location={href("/schedules", {id: queryParams.get("id")})}/>
                    </li>
                    <li>
                        <SideBarTab title="Components" location={href("/components", {id: queryParams.get("id")})}/>
                    </li>
                    <li>
                        <SideBarTab title="Settings" location={href("/settings", {id: queryParams.get("id")})}/>
                    </li>
                    <li>
                        <SideBarTab title="Coops" location={href("/coops", {id: queryParams.get("id")})}/>
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
