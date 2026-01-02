'use client'

import ruleClient from "../../../client/rule";
import React, {useState, useEffect} from "react";
import {currentCoop} from "../coop-context"
import { useRouter } from 'next/navigation'
import { AppContent } from "../../../components/app-content";
import {usePageTitle} from "../../../components/app-bar";
import FloatingActionButton from "../../../components/fab";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

export default function Rules() {

    usePageTitle("Automations")

    const [hasLoaded, setHasLoaded] = useState(false);
    const [rules, setRules] = useState([]);
    const coopId = currentCoop();
    const router = useRouter();

    useEffect(() => {
        ruleClient.listRules(coopId, (rules) => {
            setRules(rules);
            setHasLoaded(true);
        })
    }, [])

    function register() {
        router.push("rules/register")
    }

    return (
        <AppContent hasLoaded={hasLoaded}>
            <div>
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 overflow-hidden">
                    {rules.map(r => (
                        r.name
                    ))}
                </div>
            </div>

            <FloatingActionButton onClick={register}>
                <FontAwesomeIcon icon={faPlus} className="h-[16px]"/>
            </FloatingActionButton>
        </AppContent>
    )
}