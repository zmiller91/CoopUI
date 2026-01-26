'use client'
import ruleClient, {
    Actuator,
    ComponentTrigger,
    Rule,
    RuleAction,
    RuleComponent, RuleNotification,
    Source
} from "../../../client/rule";
import React, {useState, useEffect} from "react";
import {Box, Card, CardHeader, List, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextInput from "../../../components/form/text-input";
import EmptyState from "./empty-state";
import getSourceSentence from "../sentences/get-source-sentence";
import AddSourceDialog from "./add-source-dialog";
import getActionSentence from "../sentences/get-action-sentence";
import AddActionDialog from "./add-action-dialog";
import AddNotificationDialog from "./add-notification-dialog";
import getNotificationSentence from "../sentences/get-notification-sentence";
import contactClient, {Contact} from "../../../client/contact";

export interface RuleEditorProps {
    setHasLoaded: (hasLoaded: boolean) => void
    coopId: string,
    rule: Rule,
    onSubmit: (rule: Rule) => void,
    submitText: string
}


export default function RuleEditor(props: RuleEditorProps) {

    const [name, setName] = useState(props.rule?.name || '');

    // Loading variables
    const [haveSignalsLoaded, setHaveSignalsLoaded] = useState(false);
    const [haveActionsLoaded, setHaveActionsLoaded] = useState(false);
    const [haveContactsLoaded, setHaveContactsLoaded] = useState(false);
    useEffect(() => {
        props.setHasLoaded(haveSignalsLoaded && haveActionsLoaded && haveContactsLoaded);
    }, [haveSignalsLoaded, haveActionsLoaded, haveContactsLoaded, props]);

    // State variables
    const [sourceDialogOpen, setSourceDialogOpen] = useState(false);
    const [editingSourceIndex, setEditingSourceIndex] = useState<number | undefined>(undefined);
    const [editingSource, setEditingSource] = useState<ComponentTrigger | undefined>(undefined)

    const [actionDialogOpen, setActionDialogOpen] = useState(false)
    const [editingActionIndex, setEditingActionIndex] = useState<number | undefined>(undefined)
    const [editingAction, setEditingAction] = useState<RuleAction | undefined>(undefined)

    const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
    const [editingNotificationIndex, setEditingNotificationIndex] = useState<number | undefined>(undefined);
    const [editingNotification, setEditingNotification] = useState<RuleNotification | undefined>(undefined);

    // Variables fetched from the API
    const [sources, setSources] = useState({} as Record<string, Source>)
    const [sourceComponents, setSourceComponents] = useState([] as RuleComponent[])
    const [actuators, setActuators] = useState({} as Record<string, Actuator>)
    const [actionComponents, setActionComponents] = useState([] as RuleComponent[])
    const [contacts, setContacts] = useState([] as Contact[]);

    // Variables to send to the server
    const [actions, setActions] = useState(props.rule?.actions || [] as RuleAction[])
    const [signals, setSignals] = useState(props.rule?.componentTriggers || [] as ComponentTrigger[])
    const [notifications, setNotifications] = useState(props.rule?.notifications || [] as RuleNotification[])

    // Source dialog callbacks
    function onSourceAdd() {
        setEditingSourceIndex(null);
        setEditingSource(null);
        setSourceDialogOpen(true);
    }

    function onSourceClick(trigger: ComponentTrigger, index: number) {
        setEditingSourceIndex(index);
        setEditingSource(trigger);
        setSourceDialogOpen(true);
    }

    function onSourceDeleted() {
        setSignals(prev => {
            if (editingSourceIndex == null) return [...prev];
            return [
                ...prev.slice(0, editingSourceIndex),
                ...prev.slice(editingSourceIndex + 1),
            ]
        });

        setSourceDialogOpen(false);
    }

    const onSourceUpdated = (signal: ComponentTrigger) => {
        setSignals(prev => {
            if (editingSourceIndex == null) return [...prev, signal];         // add
            const next = [...prev];
            next[editingSourceIndex] = signal;                                 // edit
            return next;
        });

        setSourceDialogOpen(false);
    }

    // Action dialog callbacks
    function onActionAdd() {
        setEditingActionIndex(null)
        setEditingAction(null)
        setActionDialogOpen(true)
    }

    function onActionDeleted() {
        setActions(prev => {
            if (editingActionIndex == null) return [...prev];
            return [
                ...prev.slice(0, editingActionIndex),
                ...prev.slice(editingActionIndex + 1),
            ]
        });

        setActionDialogOpen(false);
    }

    function onActionClick(action: RuleAction, index: number) {
        setEditingActionIndex(index)
        setEditingAction(action)
        setActionDialogOpen(true)
    }

    const onActionUpdated = (action: RuleAction) => {
        setActions(prev => {
            if (editingActionIndex == null) return [...prev, action];         // add
            const next = [...prev];
            next[editingActionIndex] = action;                                 // edit
            return next;
        });

        setActionDialogOpen(false);
    }

    // Notification dialog callbacks
    function onNotificationAdd() {
        setEditingNotificationIndex(null)
        setEditingNotification(null)
        setNotificationDialogOpen(true)
    }

    function onNotificationDeleted() {
        setNotifications(prev => {
            if (editingNotificationIndex == null) return [...prev];
            return [
                ...prev.slice(0, editingNotificationIndex),
                ...prev.slice(editingNotificationIndex + 1),
            ]
        });

        setNotificationDialogOpen(false);
    }

    function onNotificationClick(notification: RuleNotification, index: number) {
        setEditingNotificationIndex(index)
        setEditingNotification(notification)
        setNotificationDialogOpen(true)
    }

    const onNotificationUpdated = (notification: RuleNotification) => {
        setNotifications(prev => {
            if (editingNotificationIndex == null) return [...prev, notification];         // add
            const next = [...prev];
            next[editingNotificationIndex] = notification;                                 // edit
            return next;
        });

        setNotificationDialogOpen(false);
    }

    useEffect(() => {

        // start loading
        setHaveSignalsLoaded(false);
        setHaveActionsLoaded(false);
        setHaveContactsLoaded(false);
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

        contactClient.list(props.coopId, response => {
            setContacts(response.contacts);
            setHaveContactsLoaded(true);
        })

    }, [props.coopId]);

    useEffect(() => {
        setName(props.rule?.name || '');
        setActions(props.rule?.actions || []);
        setSignals(props.rule?.componentTriggers || []);
        setNotifications(props.rule?.notifications || []);
    }, [props.rule]);

    const submit = () => {

        const rule: Rule = {
            id: props.rule?.id,
            name: name,
            componentTriggers: signals,
            actions: actions,
            notifications: notifications
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
                                    <Box key={signal.id ?? `${signal.component.id}-${signal.signal}-${i}`}
                                        onClick={()=> onSourceClick(signal, i)}>
                                        {getSourceSentence(signal.component.type, {
                                            sourceComponent: signal.component,
                                            signal: signal.signal,
                                            operator: signal.operator,
                                            threshold: signal.threshold,
                                        })}
                                    </Box>
                                ))}
                            </Box>
                        }

                        <Button
                            variant="outlined"
                            onClick={onSourceAdd}
                            fullWidth
                            color="primary"
                        >
                            Add source
                        </Button>

                        <AddSourceDialog open={sourceDialogOpen}
                                         sources={sources}
                                         sourceComponents={sourceComponents}
                                         handleSubmit={onSourceUpdated}
                                         handleClose={() => setSourceDialogOpen(false)}
                                         handleDelete={onSourceDeleted}
                                         initial={editingSource}/>
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
                                    <Box key={action.id ?? `${action.component.id}-${action.actionKey}-${i}`}
                                         onClick={()=> onActionClick(action, i)}>
                                        {getActionSentence(action.component.type, {
                                            actuator: action.component,
                                            actionKey: action.actionKey,
                                            params: action.params,
                                        })}
                                    </Box>
                                ))}
                            </Box>
                        }

                        <Button
                            variant="outlined"
                            onClick={onActionAdd}
                            fullWidth
                            color="primary">
                            Add action
                        </Button>

                        <AddActionDialog open={actionDialogOpen}
                                         actuators={actuators}
                                         actionComponents={actionComponents}
                                         handleSubmit={onActionUpdated}
                                         handleClose={() => setActionDialogOpen(false)}
                                         handleDelete={onActionDeleted}
                                         initial={editingAction}/>
                    </Stack>
                </CardContent>
            </Card>

            <Card>
                <CardHeader sx={{ pb: 1 }} title={
                    <Typography variant="subtitle1" fontWeight={600}>
                        Send notification...
                    </Typography>
                }/>
                <CardContent>
                    <Stack spacing={1.25}>

                        {(!notifications || notifications.length == 0) &&
                            <EmptyState message="No notifications yet."/>
                        }

                        {(notifications && notifications.length > 0) &&
                            <Box>
                                {notifications.map((notification, i) => (
                                    <Box key={notification.id ?? `${notification.type}-${notification.level}-${i}`}
                                         onClick={()=> onNotificationClick(notification, i)}>
                                        {getNotificationSentence(notification)}
                                    </Box>
                                ))}
                            </Box>
                        }

                        <Button
                            variant="outlined"
                            onClick={onNotificationAdd}
                            fullWidth
                            color="primary">
                            Add notification
                        </Button>

                        <AddNotificationDialog open={notificationDialogOpen}
                                         contacts={contacts}
                                         handleSubmit={onNotificationUpdated}
                                         handleClose={() => setNotificationDialogOpen(false)}
                                         handleDelete={onNotificationDeleted}
                                         initial={editingNotification}/>
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