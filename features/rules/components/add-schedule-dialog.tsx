import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { ScheduleTrigger } from "../../../client/rule";
import Form from "../../../components/form/form";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import CreateSchedule from "./form-creators/schedule/create";
import DeleteDialog from "../../../components/dialog/delete";

export interface AddScheduleDialogProps {
    open: boolean,
    handleSubmit: (trigger: ScheduleTrigger) => void;
    handleClose: () => void,
    handleDelete: () => void,
    initial?: ScheduleTrigger
}

export default function AddScheduleDialog(props: AddScheduleDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [frequency, setFrequency] = useState(props.initial?.frequency || '');
    const [hour, setHour] = useState(props.initial?.hour ?? 8);
    const [minute, setMinute] = useState(props.initial?.minute ?? 0);
    const [gap, setGap] = useState(String(props.initial?.gap ?? 1));

    const [showDelete, setShowDelete] = useState(false);

    const setTime = (h: number, m: number) => {
        setHour(h);
        setMinute(m);
    };

    const handleClose = () => {
        setFrequency('');
        setHour(8);
        setMinute(0);
        setGap('1');
        props.handleClose();
    };

    const onDeleteConfirm = () => {
        props.handleDelete();
        setShowDelete(false);
    };

    const onDeleteCancel = () => {
        setShowDelete(false);
    };

    const onSubmit = () => {

        props.handleSubmit({
            id: props.initial?.id,
            frequency: frequency,
            hour: hour,
            minute: minute,
            gap: parseInt(gap, 10) || 1,
        });
        handleClose();
    };

    useEffect(() => {
        if (!props.open) return;

        setFrequency(props.initial?.frequency || '');
        setHour(props.initial?.hour ?? 8);
        setMinute(props.initial?.minute ?? 0);
        setGap(String(props.initial?.gap ?? 1));
    }, [props.open, props.initial]);

    return (
        <React.Fragment>

            <Dialog
                fullScreen={fullScreen}
                open={props.open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {props.initial ? "Update " : "New"} Schedule
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant="body2" color="text.secondary">
                            Choose when this automation should run.
                        </Typography>

                        <Form>
                            <CreateSchedule
                                frequency={frequency}
                                setFrequency={setFrequency}
                                hour={hour}
                                minute={minute}
                                setTime={setTime}
                                gap={gap}
                                setGap={setGap}
                            />
                        </Form>

                        {props.initial && <Button
                            variant="text"
                            onClick={() => setShowDelete(true)}
                            fullWidth
                            color="error">
                            Delete schedule
                        </Button>}

                        <DeleteDialog title="Delete schedule?"
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
