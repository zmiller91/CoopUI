import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {ComponentTrigger, RuleComponent, Source} from "../../../client/rule";
import SelectInput, {SelectOption} from "../../../components/form/select";
import Form from "../../../components/form/form";
import {ReactNode, useMemo, useState} from "react";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import CreateSource from "./form-creators/sources/create";

export interface AddSourceDialogProps {
    handleSubmit: (trigger: ComponentTrigger) => void;
    sourceComponents: RuleComponent[];
    sources: Record<string, Source>;
}

export default function AddSourceDialog(props: AddSourceDialogProps) {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [sourceComponentId, setSourceComponentId] = useState('');
    const [sourceComponentDeviceType, setSourceComponentDeviceType] = useState('');
    const [signal, setSignal] = useState('')
    const [threshold, setThreshold] = useState('')
    const [operator, setOperator] = useState('')

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

    const handleClickOpen = () => {
        setOpen(true);
    };


    const sourceComponent = useMemo<RuleComponent | undefined>(() => {
        return props.sourceComponents.find(c => c.id === sourceComponentId);
    }, [props.sourceComponents, sourceComponentId]);

    const handleClose = () => {
        setSourceComponentId('')
        setSourceComponentDeviceType('')
        setThreshold('')
        setSignal('')
        setOpen(false);
    };

    const onSubmit = () => {

        props.handleSubmit(                {
            component: sourceComponent,
            signal: signal,
            threshold: threshold,
            operator: operator
        })
        handleClose();
    }

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
            <Button
                variant="outlined"
                onClick={(e) => {
                    (e.currentTarget as HTMLButtonElement).blur();
                    handleClickOpen();
                }}
                fullWidth
                color="primary"
            >
                Add source
            </Button>

            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    New Trigger Condition
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant="body2" color="text.secondary">
                            Choose a trigger condition. When all conditions are met then all actions will be performed.
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
