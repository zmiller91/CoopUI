'use client'

import React, {useState} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

export function AppBar(props:AppBarProps) {

    const [navVisible, setNavVisible] = useState(true);

    return (
        <div>
            
            <div className='h-[56px] pt-4 pb-4 background-primary-500 text-neutral-200 shadow-lg'>
                    {props.onNavToggle && <span className="pl-4 pr-4 inline-block">
                        <FontAwesomeIcon icon={faBars} className='h-[24px]' onClick={props.onNavToggle}/>
                    </span>}
                    <span className='pl-4 text-[31px] leading-6 inline-block'>{props.title}</span>
            </div>
            
        </div>
    )
}

export interface AppBarProps {
    title:string,
    onNavToggle?:() => void
}