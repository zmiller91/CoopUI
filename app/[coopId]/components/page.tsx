'use client'

import componentClient from "../../../client/component";
import React, {useState, useEffect} from "react";
import {currentCoop} from "../coop-context"


function ComponentListEntry(props:ComponentListEntryProps) {
    return (
        <div className="grid grid-cols-2 items-center mt-2  mb-2 p-4 light-background border-b-2">
            <span>
                <span className="text-xl neutral-text-900">{props.name}</span>  <span className="text-xs ml-2 neutral-text-600">(SN: {props.serial})</span>
            </span>
            <span className="justify-self-end">
                {/* <Navigate path={"components/" + props.id} text="Edit" /> */}
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
        <div className="light-background dashboard-section h-full">
            <div>
                {/* <PageTitle title="Components"/> */}
            </div>
            <div className="m-2">
                <div>
                    {components.map(c => <ComponentListEntry key={c.id} name={c.name} serial={c.serial} id={c.id}/>)}
                </div>
                <div className="float-right">
                    {/* <Navigate path="components/register" text="Register Component" /> */}
                </div>
            </div>
        </div>
    )
}