'use client'

import React, {ReactNode} from 'react';
import LoadingIndicator from './loading-indicator';

export function AppContent(props:AppContent) {

    const adjustBottom = props.adjustForBottomNav === undefined ? true : props.adjustForBottomNav;
    const adjustTop = props.adjustForTopNav === undefined ? true : props.adjustForTopNav;
    const heightAdjustment = (adjustTop || adjustBottom) ? + "-" + ((adjustBottom ? 52 : 0) + (adjustTop ? 52 : 0)) + "px" : "";
    const paddingAdjustment = adjustBottom ? "pb-[56px]" : "";
    return (
        <div className="min-h-screen background-neutral-100">
            <LoadingIndicator isLoading={props.hasLoaded !== undefined ? !props.hasLoaded : false}/>
            <div className={"h-[calc(100vh"+heightAdjustment+")] w-screen overflow-auto px-4 py-3 " + paddingAdjustment + " " + (props.className || "")}>
                {(props.hasLoaded == undefined || props.hasLoaded) && props.children}
            </div>
        </div>
    )
}

export interface AppContent {
    adjustForBottomNav?: boolean;
    adjustForTopNav?: boolean;
    hasLoaded?: boolean;
    children:ReactNode;
    className?:string;
}