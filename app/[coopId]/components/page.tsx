'use client'

import componentClient from "../../../client/component";
import React, {useState, useEffect} from "react";
import {currentCoop} from "../coop-context"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import FloatingActionButton from "../../../components/fab";
import { AppContent } from "../../../components/app-content";
import {usePageTitle} from "../../../components/app-bar";

function ComponentListEntry(props:ComponentListEntryProps) {

    const router = useRouter();

    function edit() {
        router.push("components/" + props.id)
    }

    return (
        <div
            className="background-neutral-50 min-h-[64px] px-4 py-3 flex items-center border-b border-neutral-200 last:border-b-0 cursor-pointer hover:bg-neutral-50 active:bg-neutral-100"
            onClick={edit}
        >
            <div className="min-w-0">
                <div className="text-base font-medium text-neutral-900 truncate">{props.name}</div>
                <div className="text-xs text-neutral-600 truncate">{props.serial}</div>
            </div>
        </div>
    )
}

interface ComponentListEntryProps {
    name:string;
    serial:string;
    id:string;
}

export default function Components() {

    usePageTitle("Components")

    const [hasLoaded, setHasLoaded] = useState(false);
    const [components, setComponentes] = useState([]);
    const coopId = currentCoop();
    const router = useRouter();

    useEffect(() => {
        componentClient.list(coopId, (components) => {
            setComponentes(components);
            setHasLoaded(true);
        })
    }, [])

    

    function register() {
        router.push("components/register")
    }


    return (
        <AppContent hasLoaded={hasLoaded}>
            <div>
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 overflow-hidden">
                    {components.map(c => (
                        <ComponentListEntry key={c.id} name={c.name} serial={c.serial} id={c.id}/>
                    ))}
                </div>
            </div>

            <FloatingActionButton onClick={register}>
                <FontAwesomeIcon icon={faPlus} className="h-[16px]"/>
            </FloatingActionButton>
        </AppContent>
    )
}