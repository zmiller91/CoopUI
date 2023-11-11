'use client'

import React from "react";
import ExpandableTab from "../components/sidenav/expandabletab"
import SideBarTab from "../components/sidenav/tab"

export default class Sidebar extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            coopsCollapsed: true
        }

        this.collapseCoops = this.collapseCoops.bind(this);
    }
    
    collapseCoops() {
        this.setState({
            coopsCollapsed: !this.state.coopsCollapsed
        });
    }


  render() {
    return (
        <div className="ml-2 relative h-full dashboard-section">
            <div>
                <div className="ml-[5%] mr-[5%] border-b-2 mb-5">
                    <ul className="mb-5 mt-5">
                        <li>
                            <ExpandableTab/>
                        </li>
                    </ul>
                </div>
                <ul>
                    <li>
                        <SideBarTab title="Dashboard" location="/dashboard" />
                    </li>
                    <li>
                        <SideBarTab title="Schedules" location="/schedules" />
                    </li>
                    <li>
                        <SideBarTab title="Components" location="/components" />
                    </li>
                    <li>
                        <SideBarTab title="Settings" location="/settings" />
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
}
