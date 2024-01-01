'use client'

import React, {useState, useEffect} from "react";
import coopClient, { CoopDAO } from "../../client/coops"
import NavModal, { NavTab } from "../../components/nav-modal";
import { BottomNav, BottomNavTab } from "../../components/bottom-nav";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartArea, faCircleNodes, faGear } from '@fortawesome/free-solid-svg-icons'
import { currentCoop } from "./coop-context";

export function MobileBottomNav() {

    const coop = currentCoop();

    function path(p:string) {
        return "/" + coop + p
    }

    return (
        <BottomNav>
            <BottomNavTab path={path("/components")}>
                <div>
                    <div className="flex justify-center"><FontAwesomeIcon icon={faCircleNodes} className="h-[18px]"/></div>
                    <div className="text-xs">Components</div>
                </div>
            </BottomNavTab>

            <BottomNavTab path={path("/dashboard")}>
                <div>
                    <div className="flex justify-center"><FontAwesomeIcon icon={faChartArea} className="h-[18px]"/></div>
                    <div className="text-xs">Dashboard</div>
                </div>
            </BottomNavTab>

            <BottomNavTab path={path("/settings")}>
                <div>
                    <div className="flex justify-center"><FontAwesomeIcon icon={faGear} className="h-[18px]"/></div>
                    <div className="text-xs">Settings</div>
                </div>
            </BottomNavTab>
        </BottomNav>
    )
}

export interface MobileNavProps {
    onDismiss: () => void;
    visible:boolean
}

export function MobileNav(props:MobileNavProps) {

    const [coops, setCoops] = useState([] as CoopDAO[])
    const currentCoopId = currentCoop();

    useEffect(() => {
        coopClient.list((coops) => {
            setCoops(coops);
        })
    }, [currentCoopId])

    function dismiss() {
        props.onDismiss();
    }

    function path(coop:CoopDAO) {
        return "/" + coop.id + "/dashboard"
    }

    function isSelected(coop:CoopDAO) {
        return coop.id === currentCoopId;
    }

    return (
        <div>
            <NavModal onDismiss={dismiss} visible={props.visible}>
                {coops.map(coop => <NavTab key={coop.id} title={coop.name} path={path(coop)} selected={isSelected(coop)}/>)}
            </NavModal>
        </div>
    )
}
