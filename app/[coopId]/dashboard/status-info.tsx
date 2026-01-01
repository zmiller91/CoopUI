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
        return "border-error-600 bg-error-100";
        case Status.ONLINE:
        return "border-primary-600 bg-primary-100";
        case Status.UNKNOWN:
        default:
        return "border-warn-600 bg-warn-100";
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
          return props.lastCheckin + " min ago"
        }
    
        if(props.lastCheckin <= 2880) {
          return (Math.floor(props.lastCheckin / 60)) + " hours ago"
        }
    
        return (Math.floor(props.lastCheckin / 1440)) + " days ago";
      }


    return (
        <div className={props.className}>
            <div className="flex items-center gap-2">
                <span className={"w-3.5 h-3.5 rounded-full inline-block border-2 " + statusColor(getStatus())}></span>
                <span className="text-sm font-medium text-neutral-800">{statusDisplayname(getStatus())}</span>
                {!props.preview &&
                    <span>
                        <span className="mx-2 text-neutral-400">·</span>
                        <span className="text-xs text-neutral-600">{getCheckIn()}</span>
                    </span>
                }

            </div>

        </div>
    )
}

export interface StatusInfoProps {
    lastCheckin:number;
    className?:string;
    preview?: boolean;
}