'use client'

import ruleClient, {
    Actuator,
    ComponentTrigger,
    Rule,
    RuleAction,
    RuleComponent,
    Source
} from "../../../../client/rule";
import React, {useState, useEffect, useMemo} from "react";
import {currentCoop} from "../../coop-context"
import { useRouter } from 'next/navigation'
import { AppContent } from "../../../../components/app-content";
import {usePageTitle} from "../../../../components/app-bar";
import TextInput from "../../../../components/form/text-input";
import AddActionDialog from "../../../../features/rules/components/add-action-dialog";
import getActionSentence from "../../../../features/rules/sentences/get-action-sentence";
import AddSourceDialog from "../../../../features/rules/components/add-source-dialog";
import getSourceSentence from "../../../../features/rules/sentences/get-source-sentence";
import {Box, Card, CardHeader, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import EmptyState from "../../../../features/rules/components/empty-state";
import Button from "@mui/material/Button";

export default function Rules() {

    usePageTitle("New Automation")

    const [name, setName] = useState('');
    const coopId = currentCoop();
    const router = useRouter();

    const [haveSignalsLoaded, setHaveSignalsLoaded] = useState(false);
    const [haveActionsLoaded, setHaveActionsLoaded] = useState(false);
    const hasLoaded = useMemo<boolean>(() => haveActionsLoaded && haveSignalsLoaded,
        [haveActionsLoaded, haveSignalsLoaded]);

    const [sources, setSources] = useState({} as Record<string, Source>)
    const [sourceComponents, setSourceComponents] = useState([] as RuleComponent[])

    const [actuators, setActuators] = useState({} as Record<string, Actuator>)
    const [actionComponents, setActionComponents] = useState([] as RuleComponent[])

    const [actions, setActions] = useState([] as RuleAction[])
    const onNewActuationAdded = (action: RuleAction) => {
        setActions(prev => [...prev, action])
    }

    const [signals, setSignals] = useState([] as ComponentTrigger[])
    const onNewSignalAdded = (signal: ComponentTrigger) => {
        setSignals(prev => [...prev, signal])
    }

    useEffect(() => {

        ruleClient.listRuleSources(coopId, result => {
            setSources(result?.sources || {})
            setSourceComponents(result?.components || [])
            setHaveSignalsLoaded(true)
        })

        ruleClient.listActuators(coopId, result => {
            setActionComponents(result.components)
            setActuators(result.actions)
            setHaveActionsLoaded(true)
        })

    }, [])

    const submit = () => {

        const rule: Rule = {
            name: name,
            componentTriggers: signals,
            actions: actions
        }

        ruleClient.create(coopId, rule, (rule) => {
            router.push(`/${coopId}/rules`);
        })
    }

    return (
        <AppContent hasLoaded={hasLoaded}>

            <Stack spacing={2}>

                <TextInput id="name" title="Automation name" value={name} onChange={setName} required={true}/>
                <Typography variant="body2" color="text.secondary">
                    Define what to watch for, then choose what happens automatically.
                </Typography>

                <Card>

                    <CardHeader sx={{ pb: 1 }} title={
                        <Typography variant="subtitle1" fontWeight={600}>
                            When this happens...
                        </Typography>
                    }/>

                    <CardContent>
                        <Stack spacing={1.25}>

                            {(!signals || signals.length == 0) &&
                                <EmptyState message="No sources yet."/>
                            }

                            {(signals && signals.length > 0) &&
                                <Box>
                                    {signals.map((signal, i) => (
                                        <React.Fragment key={signal.id ?? `${signal.component.id}-${signal.signal}-${i}`}>
                                            {getSourceSentence(signal.component.type, {
                                                sourceComponent: signal.component,
                                                signal: signal.signal,
                                                operator: signal.operator,
                                                threshold: signal.threshold
                                            })}
                                        </React.Fragment>
                                    ))}
                                </Box>
                            }

                            <AddSourceDialog sources={sources} sourceComponents={sourceComponents} handleSubmit={onNewSignalAdded}/>
                        </Stack>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader sx={{ pb: 1 }} title={
                        <Typography variant="subtitle1" fontWeight={600}>
                            Then do this...
                        </Typography>
                    }/>
                    <CardContent>
                        <Stack spacing={1.25}>

                            {(!actions || actions.length == 0) &&
                                <EmptyState message="No actions yet."/>
                            }

                            {(actions && actions.length > 0) &&
                                <Box>
                                    {actions.map((action, i) => (
                                        <React.Fragment key={action.id ?? `${action.component.id}-${action.actionKey}-${i}`}>
                                            {getActionSentence(action.component.type, {
                                                actuator: action.component,
                                                actionKey: action.actionKey,
                                                params: action.params,
                                            })}
                                        </React.Fragment>
                                    ))}
                                </Box>
                            }

                            <AddActionDialog actuators={actuators} actionComponents={actionComponents} handleSubmit={onNewActuationAdded}/>
                        </Stack>
                    </CardContent>
                </Card>
                <Button
                    variant="contained"
                    onClick={submit}
                    fullWidth
                    color="primary">
                    Create automation
                </Button>
            </Stack>
        </AppContent>
    )
}