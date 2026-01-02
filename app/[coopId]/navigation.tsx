'use client'

import React, {useState, useEffect} from "react";
import coopClient, { CoopDAO } from "../../client/coops"
import NavModal, { NavTab } from "../../components/nav-modal";
import { BottomNav } from "../../components/bottom-nav";
import HomeIcon from '@mui/icons-material/Home'
import BoltIcon from '@mui/icons-material/Bolt'
import SensorsIcon from '@mui/icons-material/Sensors'
import { currentCoop } from "./coop-context";

export function MobileBottomNav() {

    const coop = currentCoop();
    return (
        <BottomNav
            items={[
                { path: `/${coop}/components`, label: 'Devices', icon: <SensorsIcon /> },
                { path: `/${coop}/dashboard`, label: 'Dashboard', icon: <HomeIcon /> },
                { path: `/${coop}/rules`, label: 'Automations', icon: <BoltIcon /> },
            ]}
        />
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
