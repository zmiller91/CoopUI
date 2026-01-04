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
import {ReactNode, useMemo, useState} from "react";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import CreateValveAction from "./form-creators/actions/valve-create";

export interface AddActuatorDialogProps {
    handleSubmit: (action: RuleAction) => void;
    actionComponents: RuleComponent[];
    actuators: Record<string, Actuator>;
}

export default function AddActionDialog(props: AddActuatorDialogProps) {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [actionComponentId, setActionComponentId] = useState('');
    const [actionComponentDeviceType, setActionComponentDeviceType] = useState('');
    const [actionKey, setActionKey] = useState("");
    const [actionParams, setActionParams] = useState<Record<string, any>>({});

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setActionComponentId('')
        setActionComponentDeviceType('')
        setActionKey('')
        setActionParams({})
        setOpen(false);
    };

    const onSubmit = () => {

        props.handleSubmit(                {
            component: actionComponent,
            actionKey: actionKey,
            params: actionParams
        })
        handleClose();
    }

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
            <Button
                variant="outlined"
                onClick={(e) => {
                    (e.currentTarget as HTMLButtonElement).blur();
                    handleClickOpen();
                }}
                fullWidth
                color="primary"
            >
                Add action
            </Button>

            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    New Action
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
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={onSubmit} autoFocus>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>

    );
}
