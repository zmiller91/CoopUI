'use client'

import React, {useState} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

export function AppBar(props:AppBarProps) {

    const [navVisible, setNavVisible] = useState(true);

    return (
        <div>
            
            <div className='
            h-[56px] pt-4 pb-4
            bg-gradient-to-b from-primary-800 via-primary-800 to-primary-900
            text-neutral-200
            shadow-[0_4px_16px_rgba(0,0,0,0.35)]'>

                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20" />

                {props.onNavToggle && <span className="pl-4 pr-4 inline-block">
                    <FontAwesomeIcon icon={faBars} className='h-[22px]' onClick={props.onNavToggle}/>
                </span>}
                <span className='pl-4 text-[31px] leading-6 inline-block '>{props.title}</span>
            </div>
            
        </div>
    )
}

export interface AppBarProps {
    title:string,
    onNavToggle?:() => void
}