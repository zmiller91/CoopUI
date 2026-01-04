import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {Actuator, RuleAction, RuleComponent} from "../../../client/rule";
import SelectInput, {SelectOption} from "../../../components/form/select";
import Form from "../../../components/form/form";
import TextInput from "../../../components/form/text-input";
import {ReactNode, useEffect, useMemo, useState} from "react";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import CreateValveAction from "./form-creators/actions/valve-create";
import DeleteDialog from "../../../components/dialog/delete";

export interface AddActuatorDialogProps {
    open: boolean,
    handleSubmit: (action: RuleAction) => void;
    handleClose: () => void,
    handleDelete: () => void,
    actionComponents: RuleComponent[];
    actuators: Record<string, Actuator>;
    initial?: RuleAction
}

export default function AddActionDialog(props: AddActuatorDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [actionComponentId, setActionComponentId] = useState(props.initial?.component.id || '');
    const [actionComponentDeviceType, setActionComponentDeviceType] = useState(props.initial?.component.type || '');
    const [actionKey, setActionKey] = useState(props.initial?.actionKey || '');
    const [actionParams, setActionParams] = useState<Record<string, any>>(props.initial?.params || {});

    const[showDelete, setShowDelete] = useState(false)

    const handleClose = () => {
        setActionComponentId('')
        setActionComponentDeviceType('')
        setActionKey('')
        setActionParams({})
        props.handleClose()
    };

    const onDeleteConfirm = () => {
        props.handleDelete()
        setShowDelete(false)
    }

    const onDeleteCancel = () => {
        setShowDelete(false)
    }

    const onSubmit = () => {
        props.handleSubmit(                {
            component: actionComponent,
            actionKey: actionKey,
            params: actionParams
        })

        handleClose();
    }

    useEffect(() => {
        if (!props.open) return;

        setActionComponentId(props.initial?.component.id || '')
        setActionComponentDeviceType(props.initial?.component.type || '')
        setActionKey(props.initial?.actionKey || '')
        setActionParams(props.initial?.params || {})
    }, [props.open, props.initial]);

    const onActionComponentChanged = (value: string) => {
        const component = props.actionComponents.filter(c => c.id == value)[0]
        setActionComponentId(component ? value : "")
        if(!component || component.type != actionComponentDeviceType) {
            setActionKey("")
            setActionComponentDeviceType(component?.type || "")
        }
    }

    const actionComponentOptions = useMemo<SelectOption[]>(() =>
        props.actionComponents?.map(c => ({
            value: c.id,
            label: c.name + "(" + c.serialNumber + ")"
        })), [props.actionComponents])


    const actionComponent = useMemo<RuleComponent | undefined>(() => {
        return props.actionComponents.find(c => c.id === actionComponentId);
    }, [props.actionComponents, actionComponentId]);


    const actionFormElements = useMemo<ReactNode>(() =>{
        const formElements = {
            "VALVE": <CreateValveAction actionKey={actionKey} setActionKey={setActionKey} params={actionParams} setParams={setActionParams} actionComponent={actionComponent}/>
        }

        return formElements[actionComponentDeviceType];
    }, [actionComponentDeviceType, actionKey, actionParams, actionComponent])


    return (
        <React.Fragment>

            <Dialog
                fullScreen={fullScreen}
                open={props.open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {props.initial ? "Update " : "New"}  Action
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant="body2" color="text.secondary">
                            Choose an actuator and an action. When the criteria of the rule is satisfied then this action
                            will occur.
                        </Typography>

                        <Form>
                            <SelectInput
                                id="actuator"
                                title="Actuator"
                                placeholder="Select actuator..."
                                value={actionComponentId}
                                onChange={onActionComponentChanged}
                                options={actionComponentOptions}
                            />
                            {actionFormElements}
                        </Form>

                        {props.initial && <Button
                            variant="text"
                            onClick={() => setShowDelete(true)}
                            fullWidth
                            color="error">
                            Delete action
                        </Button>}

                        <DeleteDialog title="Delete action?"
                                      onDelete={onDeleteConfirm}
                                      onCancel={onDeleteCancel}
                                      open={showDelete}/>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={onSubmit} autoFocus>
                        {props.initial ? "Save" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>

    );
}
