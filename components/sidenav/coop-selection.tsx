'use client'

import coopClient from "../../client/coops"
import React, {useState, useEffect} from "react";
import { useParams, useSearchParams  } from 'next/navigation'
import { useRouter, usePathname } from 'next/navigation'
import { href } from "../../utils/path";

export default function CoopSelection() {

    const [coops, setCoops] = useState([])
    const [selectedCoop, setSelectedCoop] = useState(null)
    const [collapsed, setCollapsed] = useState(true)

    const router = useRouter();
    const pathName = usePathname();
    const params = useParams();

    useEffect(() => {
        coopClient.list((coops) => {
            setCoops(coops);
            if (coops.length > 0) {
                for(var idx in coops) {
                    if (coops[idx].id === params["coopId"]) {
                        setSelectedCoop(coops[idx])
                    }
                }

            }
        })
    }, [params])

    function toggleCollapse() {
        setCollapsed(!collapsed)
    }
    
    function select(coop) {
        console.log(pathName)
        router.push("/" + coop.id + "/dashboard")
        setCollapsed(true)
    }
    
    function register() {
        router.push("/coop-registry")
    }

    function registerButton() {
        return <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" 
            type="button" 
            onClick={register}>
            Register Coop
        </button>
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
                                    <span className="h-full flex flex-row items-center font-bold">{coop.name}</span>
                                </div>
                            </a>
                        </li>
                    )})}
                    <li>
                        {registerButton()}
                    </li>
            
                </ul>
            </div>}

            {!selectedCoop && <div>
                {registerButton()}
            </div>}
        </div>

    )
}