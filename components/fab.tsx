"use client"

import React, {ReactNode} from "react";


export interface FloatingActionButtonProps {
    onClick: () => void,
    children:ReactNode
}

export default function FloatingActionButton(props:FloatingActionButtonProps) {
    return (
        <button className="fixed end-[16px] bottom-[calc(56px+16px)] h-[56px] w-[56px] background-accent-500 text-neutral-200 rounded-full shadow-lg no-highlights"
            onClick={props.onClick}>
            {props.children}
        </button>
    )
}