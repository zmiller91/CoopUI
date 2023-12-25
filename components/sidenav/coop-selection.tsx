'use client'

import coopClient from "../../client/coops"
import React, {useState, useEffect} from "react";
import { useSearchParams  } from 'next/navigation'

export default function CoopSelection() {

    const [coops, setCoops] = useState([])
    const [selectedCoop, setSelectedCoop] = useState(null)
    const [collapsed, setCollapsed] = useState(false)
    const queryParams = useSearchParams()

    useEffect(() => {
        coopClient.list((coops) => {
            setCoops(coops);
            if (coops.length > 0) {
                for(var idx in coops) {
                    if (coops[idx].id === queryParams.get("id")) {
                        setSelectedCoop(coops[idx])
                    }
                }

            }
        })
    }, [])

    function toggleCollapse() {
        setCollapsed(!collapsed)
    }
    
    function select(coop) {
        setSelectedCoop(coop)
        toggleCollapse()
    }

    return (

        <div>
            {selectedCoop && <div className="">
                <button type="button" 
                    className="p-2 flex items-center w-full text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" 
                    onClick={toggleCollapse}>

                    <span className="flex-1 text-left whitespace-nowrap">
                        <div>
                            <span className="h-full flex flex-row items-center font-bold">{selectedCoop.name}</span>
                        </div>
                    </span>

                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                    </svg>

                </button>
                
                <ul className={( collapsed ? " hidden " : "")}> 
            
                    {coops.filter(coop => coop.id != selectedCoop.id).map(coop => { return (
                        <li key={coop.id} className="">
                            <a className="p-2 flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer" 
                                onClick={() => select(coop)}>
                                <div>
                                    <span className="h-full flex flex-row items-center font-bold">{selectedCoop.name}</span>
                                </div>
                            </a>
                        </li>
                    )})}
            
                </ul>
            </div>}
        </div>

    )
}