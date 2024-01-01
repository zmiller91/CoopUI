'use client'

import componentClient from "../../../client/component";
import React, {useState, useEffect} from "react";
import {currentCoop} from "../coop-context"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import FloatingActionButton from "../../../components/fab";


function ComponentListEntry(props:ComponentListEntryProps) {

    const router = useRouter();

    function edit() {
        router.push("components/" + props.id)
    }

    return (
        <div className="min-h-[72px] pl-4 pr-4 pt-4 pb-4 flex items-center border-b-2" onClick={edit}>
            <div>
                <div className="text-lg">{props.name}</div>
                <div className="text-xs text-neutral-700">{props.serial}</div>
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

    const [components, setComponentes] = useState([]);
    const coopId = currentCoop();
    const router = useRouter();

    useEffect(() => {
        componentClient.list(coopId, (components) => {
            setComponentes(components);
        })
    }, [])

    

    function register() {
        router.push("components/register")
    }


    return (
        <div className="light-background dashboard-section h-full">

            <div>
                {components.map(c => <ComponentListEntry key={c.id} name={c.name} serial={c.serial} id={c.id}/>)}
                <FloatingActionButton onClick={register}>
                    <FontAwesomeIcon icon={faPlus} className="h-[16px]"/>
                </FloatingActionButton>
            </div>
        </div>
    )
}