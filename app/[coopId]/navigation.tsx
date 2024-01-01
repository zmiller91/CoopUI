'use client'

import React, {useState, useEffect} from "react";
import { useParams} from 'next/navigation'
import coopClient from "../../client/coops"
import NavModal, { NavTabProps } from "../../components/nav-modal";

function location(params, page:string) {
    return "/" + params["coopId"] + "/" + page;
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

export interface MobileNavProps {
    onDismiss: () => void;
}
