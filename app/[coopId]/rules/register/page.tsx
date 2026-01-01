'use client'

import ruleClient, {Actuator, Rule, RuleComponent, Signal, Source} from "../../../../client/rule";
import React, {useState, useEffect, useMemo} from "react";
import {currentCoop} from "../../coop-context"
import { useRouter } from 'next/navigation'
import { AppContent } from "../../../../components/app-content";
import {usePageTitle} from "../../../../components/app-bar";
import TextInput from "../../../../components/form/text-input";
import Form from "../../../../components/form/form";
import SelectInput, {SelectOption} from "../../../../components/form/select";

export default function Rules() {

    usePageTitle("Rules")

    const [name, setName] = useState('');
    const coopId = currentCoop();
    const router = useRouter();


    /**
     * All of these are required to rule triggers
     */
    const [haveSignalsLoaded, setHaveSignalsLoaded] = useState(false);
    const [sourceComponentId, setSourceComponentId] = useState('');
    const [sourceComponentDeviceType, setSourceComponentDeviceType] = useState('');
    const [ruleSignal, setRuleSignal] = useState('')
    const [threshold, setThreshold] = useState('')

    const [ruleSources, setRuleSources] = useState({} as Record<string, Source>)
    const [sourceComponents, setSourceComponents] = useState([] as RuleComponent[])

    const ruleSignalOptions = useMemo<SelectOption[]>(() =>{
        return ruleSources[sourceComponentDeviceType]?.signals.map(s => ({
                value: s.key,
                label: s.displayName
        })) || []}, [ruleSources, sourceComponentDeviceType])

    const sourceComponentOptions = useMemo<SelectOption[]>(() =>
        sourceComponents?.map(c => ({
            value: c.id,
            label: c.name + "(" + c.serialNumber + ")"
        })), [ruleSources])

    const onSourceComponentChanged = (value: string) => {
        const component = sourceComponents.filter(c => c.id == value)[0]
        setSourceComponentId(component ? value : "")
        if(!component || component.type != sourceComponentDeviceType) {
            setRuleSignal("")
            setSourceComponentDeviceType(component?.type || "")
        }
    }

    /**
     * All of these are required to rule triggers
     */
    const [haveActionsLoaded, setHaveActionsLoaded] = useState(false);
    const [actionComponentId, setActionComponentId] = useState('');
    const [actionComponentDeviceType, setActionComponentDeviceType] = useState('');
    const [actionKey, setActionKey] = useState('');

    const [actuators, setActuators] = useState({} as Record<string, Actuator>)
    const [actionComponents, setActionComponents] = useState([] as RuleComponent[])

    const onActionComponentChanged = (value: string) => {
        const component = actionComponents.filter(c => c.id == value)[0]
        setActionComponentId(component ? value : "")
        if(!component || component.type != actionComponentDeviceType) {
            setActionKey("")
            setActionComponentDeviceType(component?.type || "")
        }
    }

    const actionOptions = useMemo<SelectOption[]>(() =>{
        return actuators[actionComponentDeviceType]?.actions.map(a => ({
            value: a.key,
            label: a.displayName
        })) || []}, [actuators, actionComponentDeviceType])


    const actionComponentOptions = useMemo<SelectOption[]>(() =>
        actionComponents?.map(c => ({
            value: c.id,
            label: c.name + "(" + c.serialNumber + ")"
        })), [actionComponents])

    useEffect(() => {

        ruleClient.listRuleSources(coopId, result => {
            setRuleSources(result?.sources || {})
            setSourceComponents(result?.components || [])
            setHaveSignalsLoaded(true)
        })

        ruleClient.listActuators(coopId, result => {
            setActionComponents(result.components)
            setActuators(result.actions)
            setHaveActionsLoaded(true)
        })

    }, [])

    const hasLoaded = useMemo<boolean>(() => haveActionsLoaded && haveSignalsLoaded,
        [haveActionsLoaded, haveSignalsLoaded]);


    const submit = () => {

        const rule: Rule = {
            name: name,
            componentTriggers: [
                {
                    component: {
                        id: sourceComponentId
                    },
                    operator: "LT",
                    threshold: Number(threshold),
                    signal: ruleSignal
                }
            ],
            actions: [
                {
                    component: {
                        id: actionComponentId,
                    },
                    actionKey: actionKey,
                    params: {"duration": "5"}
                }
            ]
        }

        ruleClient.create(coopId, rule, (rule) => {
            router.push("/rules");
        })
    }

    return (
        <AppContent hasLoaded={hasLoaded}>
            <Form submitText="Create Rule" onSubmit={submit}>
                <TextInput id="name" title="Name" value={name} onChange={setName} required={true}/>
                <SelectInput id="source" title="Source" placeholder="Select source..." value={sourceComponentId} onChange={onSourceComponentChanged} options={sourceComponentOptions}/>
                <SelectInput id="signal" title="Signal" placeholder="Select signal..." value={ruleSignal} onChange={setRuleSignal} options={ruleSignalOptions}/>
                <TextInput id="threshold" title="Threshold" value={threshold} onChange={setThreshold} required={true}/>
                <SelectInput id="actuator" title="Actuator" placeholder="Select actuator..." value={actionComponentId} onChange={onActionComponentChanged} options={actionComponentOptions}/>
                <SelectInput id="signal" title="Action" placeholder="Select action..." value={actionKey} onChange={setActionKey} options={actionOptions}/>
            </Form>
        </AppContent>
    )
}