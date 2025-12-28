'use client'

import React, {ReactNode} from "react";


export function CardTitle(props: CardTitleProps) {
    return (
        <div className="mb-4">
            <div className="text-base font-semibold text-neutral-900">
                {props.title}
            </div>
            <div className="text-sm text-neutral-500">
                {props.subtitle}
            </div>
        </div>
    );
}

export interface CardTitleProps {
    title:string;
    subtitle:string;
}


export function Card(props: CardProps) {
    return (
        <div
            className={`
              p-4
              rounded-lg
              background-neutral-50
              border border-neutral-200
              cursor-pointer
              transition-shadow
              hover:shadow-sm
              hover:border-neutral-300
              ${props.className ?? ""}
            ` }
            onClick={props.onClick}
        >
            {props.children}
        </div>
    );
}

export interface CardProps {
    children:ReactNode;
    onClick?: () => void;
    className?:string;
}