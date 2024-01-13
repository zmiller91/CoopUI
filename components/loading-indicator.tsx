"use client"

import "../css/loading-indicator.css"
import React from 'react'

export default function LoadingIndicator(props:LoadingIndicatorProps) {

    return (
        <div>
            {props.isLoading && <progress className="w-screen h-2 pure-material-progress-linear fixed top-[56px]"/>}
        </div>
    )
}

export interface LoadingIndicatorProps {
    isLoading:boolean;
}