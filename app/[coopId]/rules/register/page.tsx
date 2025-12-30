'use client'

import ruleClient, {Rule} from "../../../../client/rule";
import React, {useState, useEffect} from "react";
import {currentCoop} from "../../coop-context"
import { useRouter } from 'next/navigation'
import { AppContent } from "../../../../components/app-content";
import {usePageTitle} from "../../../../components/app-bar";
import TextInput from "../../../../components/form/text-input";
import Form from "../../../../components/form/form";

export default function Rules() {

    usePageTitle("Rules")

    const [hasLoaded, setHasLoaded] = useState(false);
    const [name, setName] = useState('');
    const [triggerComponent, setTriggerComponent] = useState('');
    const [actionComponent, setActionComponent] = useState('');
    const [metric, setMetric] = useState('');
    const [threshold, setThreshold] = useState('')
    const coopId = currentCoop();
    const router = useRouter();

    const submit = () => {

        const rule: Rule = {
            name: name,
            componentTriggers: [
                {
                    component: {
                        id: triggerComponent
                    },
                    operator: "LT",
                    threshold: Number(threshold),
                    metric: metric
                }
            ],
            actions: [
                {
                    component: {
                        id: actionComponent,
                    },
                    action: JSON.stringify({
                        commandId: "1007",
                        durationInMinutes: 5
                    })
                }
            ]
        }

        ruleClient.create(coopId, rule, (rule) => {
            router.push("/rules");
        })
    }

    useEffect(() => {
        setHasLoaded(true);
    }, [])

    return (
        <AppContent hasLoaded={hasLoaded}>
            <Form submitText="Create Rule" onSubmit={submit}>
                <TextInput id="name" title="Name" value={name} onChange={setName} required={true}/>
                <TextInput id="component" title="Trigger Component" value={triggerComponent} onChange={setTriggerComponent} required={true}/>
                <TextInput id="metric" title="Metric" value={metric} onChange={setMetric} required={true}/>
                <TextInput id="threshold" title="Threshold" value={threshold} onChange={setThreshold} required={true}/>
                <TextInput id="component" title="Action Component" value={actionComponent} onChange={setActionComponent} required={true}/>
            </Form>
        </AppContent>
    )
}