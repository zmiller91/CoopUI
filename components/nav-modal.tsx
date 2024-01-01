'use client'

import React, {ReactNode} from "react";
import Swipeable from "./swipeable";
import { useRouter } from 'next/navigation'


export interface NavTabProps {
    title:string,
    path:string,
    selected?:boolean
}

function NavTab(props:NavTabProps) {

    const router = useRouter();

    function goTo() {
        router.push(props.path);
    }

    function selectedClass() {
        return props.selected ? "background-accent-200 text-accent-600 rounded-md" : "";
    }

    return (
        <div className={"h-[48px] neutral-text-900 flex items-center pl-2 pr-2 font-semibold " + selectedClass()} onClick={goTo}>
            {props.title}
        </div>
    )
}

export interface NavModalProps {
    onDismiss:() => void,
    tabs:NavTabProps[]
}

export default function NavModal(props:NavModalProps) {

    function dismissClick(event) {
        event.preventDefault();
        if(event.target === event.currentTarget) {
           dismiss()
        }
    }

    function dismiss() {
        props.onDismiss();
    }

    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <Swipeable onSwipeLeft={dismiss}>
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div className="fixed inset-0 z-10 w-screen overflow-hidden">
                    <div className="flex justify-left" onClick={dismissClick}>
                        <div className="relative transform overflow-y-auto bg-white shadow-xl transition-all h-[100vh] w-[calc(100vw-56px)]">

                            <div className="h-[100%] pl-2 pr-2">

                                <div className="mb-4 pl-2 pr-2">
                                    <div className="h-[36px] text-xl pt-3 font-semibold">Auto Coop</div>
                                    <div className="h-[20px] text-sm pt-1 neutral-text-700">Taking the worry out of coop management</div>
                                </div>
                                <div className="h-[calc(100%-72px)]">
                                    <div className="min-h-[calc(100%-56px)] border-b-2">
                                        {props.tabs.map(tab => {return (
                                            <NavTab key={tab.path} title={tab.title} path={tab.path} selected={tab.selected}/>
                                        )})}
                                    </div>
                                    
                                    <div className="h-[48px] neutral-text-900 flex items-center pl-2 pr-2 font-semibold mt-2">
                                        Settings & Account
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </Swipeable>
        </div>
    )
}