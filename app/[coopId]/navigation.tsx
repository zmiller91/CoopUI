'use client'

import React, {useState, useEffect} from "react";
import { useParams} from 'next/navigation'
import coopClient from "../../client/coops"
import NavModal, { NavTabProps } from "../../components/nav-modal";
import { BottomNav, BottomNavTab } from "../../components/bottom-nav";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartArea, faCircleNodes, faGear } from '@fortawesome/free-solid-svg-icons'
import { currentCoop } from "./coop-context";

function location(params, page:string) {
    return "/" + params["coopId"] + "/" + page;
}


export function MobileBottomNav() {

    const coop = currentCoop();

    function path(p:string) {
        return "/" + coop + p
    }

    return (
        <BottomNav>
            <BottomNavTab path={path("/components")}>
                <FontAwesomeIcon icon={faCircleNodes} className="h-[24px]"/>
            </BottomNavTab>

            <BottomNavTab path={path("/dashboard")}>
                <FontAwesomeIcon icon={faChartArea} className="h-[24px]"/>
            </BottomNavTab>

            <BottomNavTab path={path("/settings")}>
                <FontAwesomeIcon icon={faGear} className="h-[24px]"/>
            </BottomNavTab>
        </BottomNav>


    )
}






export interface MobileNavProps {
    onDismiss: () => void;
}

export function MobileNav(props:MobileNavProps) {

    const [tabs, setTabs] = useState([])
    const params = useParams();

    useEffect(() => {
        coopClient.list((coops) => {

            const tabs:NavTabProps[] = [];
            if (coops.length > 0) {
                for(var idx in coops) {
                    tabs.push({
                        title: coops[idx].name,
                        path: "/" + coops[idx].id + "/dashboard",
                        selected: coops[idx].id === params["coopId"]
                    })
                }
            }

            setTabs(tabs);
        })
    }, [params])

    function dismiss() {
        props.onDismiss();
    }

    function goTo() {
        console.log("GOTO!");
    }

    return (
        <div>
            <NavModal onDismiss={dismiss} tabs={tabs}/>
        </div>
    )
}
