'use client'

import React, {ReactNode, Children, ReactElement} from "react";
import { useRouter, usePathname } from 'next/navigation'

export interface BottomNavTabProps {
    path:string;
    children: ReactNode;
}

export function BottomNavTab(props:BottomNavTabProps) {

    const router = useRouter();
    const currentPath = usePathname();

    function goTo(path:string) {
        router.push(props.path);
    }

    function textClass() {
        return currentPath.startsWith(props.path) ? "text-neutral-100" : "text-primary-400";
    }

    return (
        <div className={"pr-3 pl-3 flex items-center justify-center cursor-pointer transition-all duration-200 " + textClass()} onClick={() => goTo(props.path)}>
            {props.children}
        </div>
    )
}

export interface BottomNavProps {
    children:ReactElement<BottomNavProps>[];
}

export function BottomNav(props:BottomNavProps) {

    function calculatTabClass() {
        const tabs = props.children.length;
        return "h-[24px] w-[clamp(80px,calc(100vw/3),126px)]";
    }

    return (
        <div className="fixed bottom-0 h-[56px] w-[100vw] background-primary-700">
            <div className="pt-2 pb-3 flex items-center justify-center h-full">

                {Children.map(props.children, child => {return (
                    <div className={calculatTabClass()}>{child}</div>
                )})}
            </div>
        </div>
    )
}