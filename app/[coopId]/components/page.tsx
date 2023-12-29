'use client'

import { Navigate } from "../../../components/navigation"
import componentClient from "../../../client/component";
import React, {useState, useEffect} from "react";
import {currentCoop} from "../coop-context"


function ComponentListEntry(props:ComponentListEntryProps) {
    return (
        <div className="grid grid-cols-2 items-center mt-4 mb-4">
            <span>
                {props.name} + {props.serial}
            </span>
            <span className="justify-self-end">
                <Navigate path={"components/" + props.id} text="Edit" />
            </span>
            
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

    useEffect(() => {
        componentClient.list(coopId, (components) => {
            setComponentes(components);
        })
    }, [])


    return (
        <div className="mr-8 ml-8">
            <div>
                {components.map(c => <ComponentListEntry key={c.id} name={c.name} serial={c.serial} id={c.id}/>)}
            </div>
            <div className="float-right">
                <Navigate path="components/register" text="Register Component" />
            </div>
        </div>
    )
}