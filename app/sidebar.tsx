'use client'

import React, {useState, useEffect} from "react";
import { useParams, usePathname, useSearchParams  } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import coopClient from "../client/coops"

function location(params, page:string) {
    return "/" + params["coopId"] + "/" + page;
}

function NavTab(props:NavTabProps) {
    return (
        <div className={props.className}>
            <Link href={props.location} className="w-full" onClick={props.onClick}>
                <span className={props.textClassName}>{props.title}</span>
            </Link>
        </div>
    )
}

interface NavTabProps {
    location:string;
    title:string;
    onClick: () => void;
    className?:string;
    textClassName?:string;
}

interface Tab {
    path:string;
    title:string;
}

function getTabs(): Tab[] {
    return [
        {title: "Dashboard", path: "dashboard"},
        {title: "Components", path: "components"},
        {title: "Settings", path: "settings"},
    ]
}

function CoopList(props:CoopListProps) {
    return props.coops.filter(c => c.id != props.selectedCoop.id).map(c =>  (
        <li key={c.id}>
            <NavTab title={c.name} location={"/" + c.id + "/dashboard"} onClick={props.onClick} className={props.className} textClassName={props.textClassName}/>
        </li>
    )) 
}

interface CoopListProps {
    selectedCoop:any;
    coops:any[];
    onClick:()=>void;
    className?:string;
    textClassName?:string;
}

function CoopSelect() {

    const [coops, setCoops] = useState([])
    const [selectedCoop, setSelectedCoop] = useState(null)
    const [expanded, setExpanded] = useState(false)

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

    function toggle() {
        setExpanded(!expanded)
    }

    return (


        <div className="w-full ">
            <div className="visible md:hidden">
                <div className="min-h-[56px]">

                    <button className="w-full primary-dark-background p-4" onClick={toggle}>
                        <span className="align-center text-3xl font-bold neutral-text-200">
                            {selectedCoop && selectedCoop.name} 
                            <span className="ml-4"><FontAwesomeIcon icon={faCaretDown}/></span>
                        </span>
                    </button>

                    {expanded && <div className="h-full light-background">
                        <div>
                            <ul>
                                <CoopList coops={coops} selectedCoop={selectedCoop} onClick={toggle}/>
                            </ul>
                        </div>
                    </div>}

                </div>
            </div>

            <div className="hidden sm:inline">

                <button className="w-full p-4" onClick={toggle}>
                    <span className="text-2xl font-bold">
                        {selectedCoop && selectedCoop.name} 
                        <span className="ml-4"><FontAwesomeIcon icon={faCaretDown}/></span>
                    </span>
                </button>

                {expanded && <div className="h-full light-background">
                    <div>
                        <ul>
                            <CoopList coops={coops} selectedCoop={selectedCoop} onClick={toggle}
                                className="p-2 flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
                                textClassName="h-full flex flex-row items-center font-bold"/>
                        </ul>
                    </div>
                </div>}

            </div>
        </div>
    )
}

function TabNav() {

    const params = useParams()
    const path = usePathname();
    const tabs = getTabs();
    const [expanded, setExpanded] = useState(false);
    const [selectedTab, setSelectedTab] = useState(getSelectedTab());

    useEffect(() => {
        setSelectedTab(getSelectedTab);
    }, [params])


    function getSelectedTab(): Tab | undefined {
        const parts:string[] = path.split("/");
        if(parts.length >= 3) {
            const tabPart = parts[2];
            return tabs.find(t => t.path === tabPart)
        }

        return null;
    }

    function toggle() {
        setExpanded(!expanded)
    }

    return (
        <div className="w-full ">
            <div className="md:hidden">
                <div className="min-h-[56px]">
                    <button className="w-full shaded-background p-4" onClick={toggle}>
                        <span className="align-center text-2xl font-bold">
                            {selectedTab.title} 
                            <span className="ml-4"><FontAwesomeIcon icon={faCaretDown}/></span>
                        </span>
                    </button>


                    {expanded && <div className="h-full light-background">
                        <div>
                            <ul>
                                {tabs.filter(t => t.path != selectedTab.path).map(t =>  (
                                    <li key={t.path}>
                                        <NavTab title={t.title} location={location(params, t.path)} onClick={toggle} className="text-center p-4 border-b-2" textClassName="text-2xl"/>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>}
                </div>
            </div>

            <div className="hidden sm:inline">

                {<div className="h-full light-background">
                    <div>
                        <ul>
                            {tabs.map(t =>  (
                                <li key={t.path}>
                                    <NavTab title={t.title} location={location(params, t.path)} onClick={toggle} 
                                        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ml-3" 
                                        textClassName="text-xl"/>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default function SideBar() {

    return <div>
        <CoopSelect/>
        <TabNav/>
    </div>

}
