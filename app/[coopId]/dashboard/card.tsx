'use client'

import React, {ReactNode} from "react";


export function CardTitle(props:CardTitleProps) {
    return (
        <div className="text-md neutral-text-700 font-semibold mb-4">
            {props.title}
        </div>
    )
}

export interface CardTitleProps {
    title:string;
}


export function Card(props:CardProps) {

    return (
        <div className="p-2">
            <div className="p-4 rounded-md shadow-md bg-white ">
                {props.children}
            </div>
        </div>


    )
}

export interface CardProps {
    children:ReactNode;
}