'use client'

import React, {ReactElement} from "react";
import Swipeable from "./swipeable";
import { useRouter } from 'next/navigation'


export interface NavTabProps {
    title:string,
    path:string,
    selected?:boolean
}

export function NavTab(props:NavTabProps) {

    const router = useRouter();

    function goTo() {
        router.push(props.path);
    }

    function selectedClass() {
        return props.selected ? "background-accent-100 text-accent-700 rounded-sm" : "";
    }

    return (
        <div className={"h-[48px] px-4 text-neutral-900 flex items-center font-medium text-sm " + selectedClass()} onClick={goTo}>
            {props.title}
        </div>
    )
}


export interface NavModalProps {
    onDismiss:() => void,
    visible:boolean,
    children:ReactElement<NavTabProps>[]
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
        <div className={"relative z-50 " + (!props.visible ? "hidden" : "")} aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <Swipeable onSwipeLeft={dismiss}>
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div className="fixed inset-0 z-10 w-screen overflow-hidden">
                    <div className="flex justify-left" onClick={dismissClick}>
                        <div className="relative transform overflow-y-auto light-background shadow-xl transition-all h-[100vh] w-[calc(100vw-56px)]">

                            <div className="h-[100%] pl-2 pr-2">

                                <div className="mb-4 pl-2 pr-2">
                                    <div className="h-[36px] text-lg pt-3 font-semibold">Auto Coop</div>
                                    <div className="h-[20px] pt-1 text-xs text-neutral-600 leading-snug">Taking the worry out of coop management</div>
                                </div>
                                <div className="h-[calc(100%-72px)]">
                                    <div className="min-h-[calc(100%-56px)] border-b border-neutral-200">
                                        
                                        {props.children}

                                    </div>
                                    
                                    <div className="h-[48px] px-4 text-neutral-700 flex items-center text-sm font-medium mt-2">
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