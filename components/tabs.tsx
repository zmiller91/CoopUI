'use client'

import React, {useState, useEffect} from "react";

export default function Tabs(props:TabProps) {

    const [selected, setSelected] = useState(props.tabs[0]);

    function selectedClass(tab:string) {
        return tab === selected ? "border-b-2 border-accent-500" : "border-b-2 border-accent-00";
    }

    function select(tab:string) {
        setSelected(tab);
        props.onChange(tab);
    }

    return (
        <div className={"h-[48px] w-full grid grid-cols-" + props.tabs.length}>
            {props.tabs.map(t => {
                return <div  key={t} className={"block flex items-center justify-center text-sm font-semibold " + 
                "pl-2 pr-2 pb-3 pt-3 cursor-pointer " + selectedClass(t)} onClick={() => select(t)}>
                    <span>{t}</span>
                </div>
                })
            }
        </div>
    )
}

export interface TabProps {
    tabs:string[];
    onChange:(tab:string)=>void;
}