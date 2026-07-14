import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { TimeTrigger } from "../../../client/rule";
import Form from "../../../components/form/form";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import CreateTimeCondition from "./form-creators/time-condition/create";
import ConfirmDialog from "../../../components/dialog/confirm";

export interface AddTimeConditionDialogProps {
    open: boolean,
    handleSubmit: (trigger: TimeTrigger) => void;
    handleClose: () => void,
    handleDelete: () => void,
    initial?: TimeTrigger
}

export default function AddTimeConditionDialog(props: AddTimeConditionDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [operator, setOperator] = useState(props.initial?.operator || '');
    const [hour, setHour] = useState(props.initial?.hour ?? 8);
    const [minute, setMinute] = useState(props.initial?.minute ?? 0);

    const [showDelete, setShowDelete] = useState(false);

    const setTime = (h: number, m: number) => {
        setHour(h);
        setMinute(m);
    };

    const handleClose = () => {
        setOperator('');
        setHour(8);
        setMinute(0);
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
            operator: operator,
            hour: hour,
            minute: minute,
        });
        handleClose();
    };

    useEffect(() => {
        if (!props.open) return;

        setOperator(props.initial?.operator || '');
        setHour(props.initial?.hour ?? 8);
        setMinute(props.initial?.minute ?? 0);
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
                    {props.initial ? "Update " : "New"} Time Condition
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant="body2" color="text.secondary">
                            Only run this automation before or after a certain time of day.
                        </Typography>

                        <Form>
                            <CreateTimeCondition
                                operator={operator}
                                setOperator={setOperator}
                                hour={hour}
                                minute={minute}
                                setTime={setTime}
                            />
                        </Form>

                        {props.initial && <Button
                            variant="text"
                            onClick={() => setShowDelete(true)}
                            fullWidth
                            color="error">
                            Delete time condition
                        </Button>}

                        <ConfirmDialog title="Delete time condition?"
                                      onConfirm={onDeleteConfirm}
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
