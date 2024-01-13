"use client"

import "../css/loading-indicator.css"
import React, {useEffect, useState}  from 'react'

export default function SnackBar(props:SnackBarProps) {

    const [displayed, setDisplayed] = useState(true);
    

    useEffect(() => {
        setDisplayed(props.display);
        if (props.display) {
            setTimeout(() => {
                setDisplayed(false)
                props.callback(false);
            }, 5000);
        }
            
    }, [props.display]);

    return (
        <div>
            {displayed && <div className="h-[48px] w-full fixed bottom-[64px] pl-2 pr-2">
                <span className="block w-full h-full border-solid border-2 rounded-md flex flex-row items-center 
                                pr-4 pl-4 pt-[6px] pb-[6px] background-neutral-900 text-neutral-300 text-sm shadow-lg">
                    {props.message}
                </span>
            </div>}
        </div>
    )
}

export interface SnackBarProps {
    message:string;
    display:boolean;
    callback: (displayed:boolean) => void;
}