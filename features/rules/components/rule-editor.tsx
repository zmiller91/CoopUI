'use client'
import ruleClient, {
    Actuator,
    ComponentTrigger,
    Rule,
    RuleAction,
    RuleComponent,
    Source
} from "../../../client/rule";
import React, {useState, useEffect} from "react";
import {Box, Card, CardHeader, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextInput from "../../../components/form/text-input";
import EmptyState from "./empty-state";
import getSourceSentence from "../sentences/get-source-sentence";
import AddSourceDialog from "./add-source-dialog";
import getActionSentence from "../sentences/get-action-sentence";
import AddActionDialog from "./add-action-dialog";


export interface RuleEditorProps {
    setHasLoaded: (hasLoaded: boolean) => void
    coopId: string,
    rule: Rule,
    onSubmit: (rule: Rule) => void,
    submitText: string
}


export default function RuleEditor(props: RuleEditorProps) {

    const [name, setName] = useState(props.rule?.name || '');

    const [haveSignalsLoaded, setHaveSignalsLoaded] = useState(false);
    const [haveActionsLoaded, setHaveActionsLoaded] = useState(false);

    useEffect(() => {
        props.setHasLoaded(haveSignalsLoaded && haveActionsLoaded);
    }, [haveSignalsLoaded, haveActionsLoaded, props]);

    const [actions, setActions] = useState(props.rule?.actions || [] as RuleAction[])
    const onNewActuationAdded = (action: RuleAction) => {
        setActions(prev => [...prev, action])
    }

    const [signals, setSignals] = useState(props.rule?.componentTriggers || [] as ComponentTrigger[])
    const onNewSignalAdded = (signal: ComponentTrigger) => {
        setSignals(prev => [...prev, signal])
    }

    const [sources, setSources] = useState({} as Record<string, Source>)
    const [sourceComponents, setSourceComponents] = useState([] as RuleComponent[])

    const [actuators, setActuators] = useState({} as Record<string, Actuator>)
    const [actionComponents, setActionComponents] = useState([] as RuleComponent[])

    useEffect(() => {

        console.log("IM HERE...")

        // start loading
        setHaveSignalsLoaded(false);
        setHaveActionsLoaded(false);
        props.setHasLoaded(false);

        ruleClient.listRuleSources(props.coopId, result => {
            setSources(result?.sources || {});
            setSourceComponents(result?.components || []);
            setHaveSignalsLoaded(true);
        });

        ruleClient.listActuators(props.coopId, result => {
            setActionComponents(result.components || []);
            setActuators(result.actions || {});
            setHaveActionsLoaded(true);
        });
    }, [props.coopId]);

    useEffect(() => {
        setName(props.rule?.name || '');
        setActions(props.rule?.actions || []);
        setSignals(props.rule?.componentTriggers || []);
    }, [props.rule]);

    const submit = () => {

        const rule: Rule = {
            name: name,
            componentTriggers: signals,
            actions: actions
        }

        props.onSubmit(rule)
    }

    return (

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
                {props.submitText}
            </Button>
        </Stack>
    )
}