"use client"

import React from "react";

function statusDisplayname(status:Status) {
    switch(status) {
        case Status.OFFLINE:
        return "Offline";
        case Status.ONLINE:
        return "Online";
        case Status.UNKNOWN:
        default:
        return "Unknown";
    }
}

function statusColor(status:Status) {
    switch(status) {
        case Status.OFFLINE:
        return "border-error-500 background-error-300";
        case Status.ONLINE:
        return "border-accent-500 background-accent-300";
        case Status.UNKNOWN:
        default:
        return "border-warn-500 background-warn-300";
    }
}

export enum Status {
    OFFLINE,
    UNKNOWN,
    ONLINE,
}

export function StatusInfo(props:StatusInfoProps) {

    function getStatus() {
        if(props.lastCheckin <= 240) {
          return Status.ONLINE;
        }
    
        if(props.lastCheckin >= 720) {
          return Status.OFFLINE;
        }
    
        return Status.UNKNOWN;
      }
    
    
      function getCheckIn() {
    
        if(props.lastCheckin  <= 240) {
          return props.lastCheckin + " mins. ago"
        }
    
        if(props.lastCheckin <= 2880) {
          return (Math.floor(props.lastCheckin / 120)) + " hours ago"
        }
    
        return (Math.floor(props.lastCheckin / 1440)) + " days ago";
      }


    return (
        <div className={props.className}>
            <div className="flex items-center">
                <span className={"w-[15px] h-[15px] rounded-full inline-block mr-2 border-2 " + statusColor(getStatus())}></span>
                <span className="text-sm pt-1">{statusDisplayname(getStatus())}</span>
            </div>
            <div className="text-sm text-neutral-500">{getCheckIn()}</div>
        </div>
    )
}

export interface StatusInfoProps {
    lastCheckin:number;
    className?:string;
}