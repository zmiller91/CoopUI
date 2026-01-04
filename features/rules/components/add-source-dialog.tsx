import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {ComponentTrigger, Rule, RuleComponent, Source} from "../../../client/rule";
import SelectInput, {SelectOption} from "../../../components/form/select";
import Form from "../../../components/form/form";
import {ReactNode, useEffect, useMemo, useState} from "react";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import CreateSource from "./form-creators/sources/create";
import DeleteDialog from "../../../components/dialog/delete";

export interface AddSourceDialogProps {
    open: boolean,
    handleSubmit: (trigger: ComponentTrigger) => void;
    handleClose: () => void,
    handleDelete: () => void,
    sourceComponents: RuleComponent[];
    sources: Record<string, Source>;
    initial?: ComponentTrigger
}

export default function AddSourceDialog(props: AddSourceDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [sourceComponentId, setSourceComponentId] = useState(props.initial?.component.id || '');
    const [sourceComponentDeviceType, setSourceComponentDeviceType] = useState(props.initial?.component.type || '');
    const [signal, setSignal] = useState(props.initial?.signal || '')
    const [threshold, setThreshold] = useState(props.initial?.threshold || '')
    const [operator, setOperator] = useState(props.initial?.operator || '')

    const[showDelete, setShowDelete] = useState(false)

    const sourceComponentOptions = useMemo<SelectOption[]>(() =>
        props.sourceComponents?.map(c => ({
            value: c.id,
            label: c.name + "(" + c.serialNumber + ")"
        })), [props.sourceComponents])

    const onSourceComponentChanged = (value: string) => {
        const component = props.sourceComponents.filter(c => c.id == value)[0]
        setSourceComponentId(component ? value : "")
        if(!component || component.type != sourceComponentDeviceType) {
            setSignal("")
            setSourceComponentDeviceType(component?.type || "")
        }
    }

    const sourceComponent = useMemo<RuleComponent | undefined>(() => {
        return props.sourceComponents.find(c => c.id === sourceComponentId);
    }, [props.sourceComponents, sourceComponentId]);

    const handleClose = () => {
        setSourceComponentId('')
        setSourceComponentDeviceType('')
        setThreshold('')
        setSignal('')
        props.handleClose();
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
            component: sourceComponent,
            signal: signal,
            threshold: threshold,
            operator: operator
        })
        handleClose();
    }

    useEffect(() => {
        if (!props.open) return;

        setSourceComponentId(props.initial?.component?.id || '');
        setSourceComponentDeviceType(props.initial?.component?.type || '');
        setSignal(props.initial?.signal || '');
        setThreshold(props.initial?.threshold || '');
        setOperator(props.initial?.operator || '');
    }, [props.open, props.initial]);

    const sourceFormElements = useMemo<ReactNode>(() => {

        const baseProps = {sourceComponent, signal, setSignal, threshold, setThreshold, operator, setOperator}

        const formElements = {
            MOISTURE: <CreateSource {...baseProps}
                options={[{ label: "Soil Moisture (%)", value: "MOISTURE_PERCENT" }]}
            />,
            SCALE: <CreateSource {...baseProps}
                                 options={[{ label: "Weight (grams)", value: "WEIGHT" }]}
            />,
            WEATHER: <CreateSource {...baseProps}
                                 options={[
                                     { label: "Humidity", value: "HUMIDITY" },
                                     { label: "Temperature", value: "TEMPERATURE" }
                                 ]}
            />,
        };

        return sourceComponentOptions && sourceComponentDeviceType ? formElements[sourceComponentDeviceType] : null;
    }, [sourceComponentDeviceType, sourceComponent, signal, threshold, operator]);


    return (
        <React.Fragment>

            <Dialog
                fullScreen={fullScreen}
                open={props.open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {props.initial ? "Update " : "New"} Source Condition
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant="body2" color="text.secondary">
                            Choose a source condition. When all conditions are met then all actions will be performed.
                        </Typography>

                        <Form>
                            <SelectInput
                                id="device"
                                title="Source Device"
                                placeholder="Select device..."
                                value={sourceComponentId}
                                onChange={onSourceComponentChanged}
                                options={sourceComponentOptions}
                            />
                            {sourceFormElements}
                        </Form>

                        {props.initial && <Button
                            variant="text"
                            onClick={() => setShowDelete(true)}
                            fullWidth
                            color="error">
                            Delete source condition
                        </Button>}

                        <DeleteDialog title="Delete source condition?"
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
