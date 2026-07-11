'use client'
import ruleClient, {
    Actuator,
    ComponentTrigger,
    Rule,
    RuleAction,
    RuleComponent, RuleNotification,
    ScheduleTrigger,
    Source,
    TimeTrigger
} from "../../../client/rule";
import React, {useState, useEffect} from "react";
import {Box, Card, CardHeader, List, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
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
import AddScheduleDialog from "./add-schedule-dialog";
import ScheduleSentence from "../sentences/schedule-sentence";
import componentClient, {ComponentPort} from "../../../client/component";
import AddTimeConditionDialog from "./add-time-condition-dialog";
import TimeConditionSentence from "../sentences/time-condition-sentence";

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

    // Trigger type - a rule is either condition-triggered or schedule-triggered, never both
    const [triggerType, setTriggerType] = useState<'CONDITION' | 'SCHEDULE'>(
        (props.rule?.scheduleTriggers?.length ?? 0) > 0 ? 'SCHEDULE' : 'CONDITION'
    );

    // State variables
    const [sourceDialogOpen, setSourceDialogOpen] = useState(false);
    const [editingSourceIndex, setEditingSourceIndex] = useState<number | undefined>(undefined);
    const [editingSource, setEditingSource] = useState<ComponentTrigger | undefined>(undefined)

    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
    const [editingScheduleIndex, setEditingScheduleIndex] = useState<number | undefined>(undefined);
    const [editingSchedule, setEditingSchedule] = useState<ScheduleTrigger | undefined>(undefined)

    const [timeConditionDialogOpen, setTimeConditionDialogOpen] = useState(false);
    const [editingTimeConditionIndex, setEditingTimeConditionIndex] = useState<number | undefined>(undefined);
    const [editingTimeCondition, setEditingTimeCondition] = useState<TimeTrigger | undefined>(undefined)

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
    const [portsByComponent, setPortsByComponent] = useState({} as Record<string, ComponentPort[]>)

    // Variables to send to the server
    const [actions, setActions] = useState(props.rule?.actions || [] as RuleAction[])
    const [signals, setSignals] = useState(props.rule?.componentTriggers || [] as ComponentTrigger[])
    const [scheduleTriggers, setScheduleTriggers] = useState(props.rule?.scheduleTriggers || [] as ScheduleTrigger[])
    const [timeTriggers, setTimeTriggers] = useState(props.rule?.timeTriggers || [] as TimeTrigger[])
    const [notifications, setNotifications] = useState(props.rule?.notifications || [] as RuleNotification[])

    // Switching trigger type only changes which card is shown - the inactive list is kept around so toggling
    // back and forth doesn't discard in-progress edits. submit() below drops whichever list isn't active, so
    // the exclusivity is still enforced at save time.
    function onTriggerTypeChange(next: 'CONDITION' | 'SCHEDULE' | null) {
        if (!next || next === triggerType) return;
        setTriggerType(next);
    }

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

    // Schedule dialog callbacks
    function onScheduleAdd() {
        setEditingScheduleIndex(null);
        setEditingSchedule(null);
        setScheduleDialogOpen(true);
    }

    function onScheduleClick(trigger: ScheduleTrigger, index: number) {
        setEditingScheduleIndex(index);
        setEditingSchedule(trigger);
        setScheduleDialogOpen(true);
    }

    function onScheduleDeleted() {
        setScheduleTriggers(prev => {
            if (editingScheduleIndex == null) return [...prev];
            return [
                ...prev.slice(0, editingScheduleIndex),
                ...prev.slice(editingScheduleIndex + 1),
            ]
        });

        setScheduleDialogOpen(false);
    }

    const onScheduleUpdated = (trigger: ScheduleTrigger) => {
        setScheduleTriggers(prev => {
            if (editingScheduleIndex == null) return [...prev, trigger];         // add
            const next = [...prev];
            next[editingScheduleIndex] = trigger;                                 // edit
            return next;
        });

        setScheduleDialogOpen(false);
    }

    // Time condition dialog callbacks
    function onTimeConditionAdd() {
        setEditingTimeConditionIndex(null);
        setEditingTimeCondition(null);
        setTimeConditionDialogOpen(true);
    }

    function onTimeConditionClick(trigger: TimeTrigger, index: number) {
        setEditingTimeConditionIndex(index);
        setEditingTimeCondition(trigger);
        setTimeConditionDialogOpen(true);
    }

    function onTimeConditionDeleted() {
        setTimeTriggers(prev => {
            if (editingTimeConditionIndex == null) return [...prev];
            return [
                ...prev.slice(0, editingTimeConditionIndex),
                ...prev.slice(editingTimeConditionIndex + 1),
            ]
        });

        setTimeConditionDialogOpen(false);
    }

    const onTimeConditionUpdated = (trigger: TimeTrigger) => {
        setTimeTriggers(prev => {
            if (editingTimeConditionIndex == null) return [...prev, trigger];         // add
            const next = [...prev];
            next[editingTimeConditionIndex] = trigger;                                 // edit
            return next;
        });

        setTimeConditionDialogOpen(false);
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
        setScheduleTriggers(props.rule?.scheduleTriggers || []);
        setTimeTriggers(props.rule?.timeTriggers || []);
        setTriggerType((props.rule?.scheduleTriggers?.length ?? 0) > 0 ? 'SCHEDULE' : 'CONDITION');
        setNotifications(props.rule?.notifications || []);
    }, [props.rule]);

    // Ports carry the friendly zone names shown in action sentences (e.g. "Turn on Garden beds" instead of
    // "Turn on 0") - fetch them for any action's component we haven't already cached.
    useEffect(() => {
        const missingComponentIds = Array.from(new Set(
            actions
                .map(a => a.component?.id)
                .filter((id): id is string => !!id && !(id in portsByComponent))
        ));

        missingComponentIds.forEach(id => {
            componentClient.get(id, (c) => {
                setPortsByComponent(prev => ({ ...prev, [id]: c.ports ?? [] }));
            });
        });
    }, [actions]);

    function getZoneLabel(action: RuleAction): string | undefined {
        const ports = action.component?.id ? portsByComponent[action.component.id] : undefined;
        const port = ports?.find(p => String(p.index) === action.params?.zone);
        return port?.name;
    }

    const submit = () => {

        const rule: Rule = {
            id: props.rule?.id,
            name: name,
            componentTriggers: triggerType === 'CONDITION' ? signals : [],
            scheduleTriggers: triggerType === 'SCHEDULE' ? scheduleTriggers : [],
            timeTriggers: triggerType === 'CONDITION' ? timeTriggers : [],
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

            <ToggleButtonGroup
                value={triggerType}
                exclusive
                onChange={(_, next) => onTriggerTypeChange(next)}
                fullWidth
                color="primary"
                size="small"
            >
                <ToggleButton value="CONDITION">Condition</ToggleButton>
                <ToggleButton value="SCHEDULE">Schedule</ToggleButton>
            </ToggleButtonGroup>

            {triggerType === 'CONDITION' && (
                <Card>

                    <CardHeader sx={{ pb: 1 }} title={
                        <Typography variant="subtitle1" fontWeight={600}>
                            When this happens...
                        </Typography>
                    }/>

                    <CardContent>
                        <Stack spacing={1.25}>

                            {(!signals || signals.length == 0) && (!timeTriggers || timeTriggers.length == 0) &&
                                <EmptyState message="No conditions yet."/>
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

                            {(timeTriggers && timeTriggers.length > 0) &&
                                <Box>
                                    {timeTriggers.map((trigger, i) => (
                                        <Box key={trigger.id ?? `${trigger.operator}-${trigger.hour}-${trigger.minute}-${i}`}
                                            onClick={()=> onTimeConditionClick(trigger, i)}>
                                            <TimeConditionSentence trigger={trigger}/>
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

                            <Button
                                variant="outlined"
                                onClick={onTimeConditionAdd}
                                fullWidth
                                color="primary"
                            >
                                Add time condition
                            </Button>

                            <AddSourceDialog open={sourceDialogOpen}
                                             sources={sources}
                                             sourceComponents={sourceComponents}
                                             handleSubmit={onSourceUpdated}
                                             handleClose={() => setSourceDialogOpen(false)}
                                             handleDelete={onSourceDeleted}
                                             initial={editingSource}/>

                            <AddTimeConditionDialog open={timeConditionDialogOpen}
                                             handleSubmit={onTimeConditionUpdated}
                                             handleClose={() => setTimeConditionDialogOpen(false)}
                                             handleDelete={onTimeConditionDeleted}
                                             initial={editingTimeCondition}/>
                        </Stack>
                    </CardContent>
                </Card>
            )}

            {triggerType === 'SCHEDULE' && (
                <Card>

                    <CardHeader sx={{ pb: 1 }} title={
                        <Typography variant="subtitle1" fontWeight={600}>
                            On a schedule...
                        </Typography>
                    }/>

                    <CardContent>
                        <Stack spacing={1.25}>

                            {(!scheduleTriggers || scheduleTriggers.length == 0) &&
                                <EmptyState message="No schedules yet."/>
                            }

                            {(scheduleTriggers && scheduleTriggers.length > 0) &&
                                <Box>
                                    {scheduleTriggers.map((trigger, i) => (
                                        <Box key={trigger.id ?? `${trigger.frequency}-${trigger.hour}-${trigger.minute}-${i}`}
                                            onClick={()=> onScheduleClick(trigger, i)}>
                                            <ScheduleSentence trigger={trigger}/>
                                        </Box>
                                    ))}
                                </Box>
                            }

                            <Button
                                variant="outlined"
                                onClick={onScheduleAdd}
                                fullWidth
                                color="primary"
                            >
                                Add schedule
                            </Button>

                            <AddScheduleDialog open={scheduleDialogOpen}
                                             handleSubmit={onScheduleUpdated}
                                             handleClose={() => setScheduleDialogOpen(false)}
                                             handleDelete={onScheduleDeleted}
                                             initial={editingSchedule}/>
                        </Stack>
                    </CardContent>
                </Card>
            )}

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
                                            zoneLabel: getZoneLabel(action),
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