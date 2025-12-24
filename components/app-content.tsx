'use client'

import React, {ReactNode} from 'react';
import LoadingIndicator from './loading-indicator';

export function AppContent(props:AppContent) {

    const adjustBottom = props.adjustForBottomNav === undefined ? true : props.adjustForBottomNav;
    const adjustTop = props.adjustForTopNav === undefined ? true : props.adjustForTopNav;
    const heightAdjustment = (adjustBottom ? 52 : 0) + (adjustTop ? 52 : 0);

    return (
        <div>
            <LoadingIndicator isLoading={props.hasLoaded !== undefined ? !props.hasLoaded : false}/>
            <div className={"h-[calc(100vh-"+heightAdjustment+"px)] w-screen overflow-auto pr-2 pl-2 pt-4 pb-[56px] " + (props.className || "")}>
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