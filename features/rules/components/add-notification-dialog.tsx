import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {ComponentTrigger, Rule, RuleComponent, RuleNotification, Source} from "../../../client/rule";
import SelectInput, {SelectOption} from "../../../components/form/select";
import Form from "../../../components/form/form";
import {ReactNode, useEffect, useMemo, useState} from "react";
import {Checkbox, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import CreateSource from "./form-creators/sources/create";
import DeleteDialog from "../../../components/dialog/delete";
import MultiSelectInput from "../../../components/form/multi-select";
import {Contact} from "../../../client/contact";

export interface AddNotificationDialogProps {
    open: boolean,
    handleSubmit: (trigger: RuleNotification) => void;
    handleClose: () => void,
    handleDelete: () => void,
    contacts: Contact[],
    initial?: RuleNotification
}

export default function AddNotificationDialog(props: AddNotificationDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const[showDelete, setShowDelete] = useState(false)

    const [selectedContactIds, setSelectedContactIds] = useState(props.initial?.recipients?.map(c => c.id) || [])
    const [selectedChannel, setSelectedChannel] = useState(props.initial?.channel || '')
    const [selectedLevel, setSelectedLevel] = useState(props.initial?.level || '')

    const handleClose = () => {
        setSelectedContactIds([]);
        setSelectedChannel('');
        setSelectedLevel('');
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

        const contacts = props.contacts
            .filter(c => selectedContactIds.indexOf(c.id) > -1)

        const notification: RuleNotification = {
            type: 'RULE',
            level: selectedLevel,
            recipients: contacts,
            channel: selectedChannel
        }

        props.handleSubmit(notification)
        handleClose();
    }

    useEffect(() => {
        if (!props.open) return;

        setSelectedLevel(props.initial?.level || "")
        setSelectedChannel(props.initial?.channel || "")
        setSelectedContactIds(props.initial?.recipients?.map(c => c.id) || [])
    }, [props.open, props.initial]);

    const onContactChanged = (value: string[]) => {
        setSelectedContactIds(value)
    }

    const onChannelChanged = (value: string) => {
        setSelectedChannel(value)
    }

    const onLevelChanged = (value: string) => {
        setSelectedLevel(value)
    }

    const contactOptions = useMemo<SelectOption[]>(() =>
        props.contacts?.map(c => ({
            value: c.id,
            label: c.displayName
        })), [props.contacts])


    const notificationChannels = [
        {value: "EMAIL", label: "E-mail message"},
        {value: "TEXT", label: "Text message"},
        {value: "PUSH", label: "Push notification"},
        {value: "INBOX", label: "Inbox message"}
    ]

    const notificationLevels = [
        {value: "INFO", label: "Info"},
        {value: "WARN", label: "Warning"},
        {value: "CRITICAL", label: "Critical"}
    ]

    return (
        <React.Fragment>

            <Dialog
                fullScreen={fullScreen}
                open={props.open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {props.initial ? "Update " : "New"} Notification
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant="body2" color="text.secondary">
                            Choose the severity, delivery channels, and recipients.
                        </Typography>

                        <Form>


                            <SelectInput
                                id="level"
                                title="Notification Level"
                                placeholder="Select level..."
                                value={selectedLevel}
                                onChange={onLevelChanged}
                                options={notificationLevels}
                            />

                            <SelectInput
                                id="channel"
                                title="Notification Channel"
                                placeholder="Select channel..."
                                value={selectedChannel}
                                onChange={onChannelChanged}
                                options={notificationChannels}
                            />


                            <MultiSelectInput
                                id="contact"
                                title="Contacts"
                                values={selectedContactIds}
                                onChange={onContactChanged}
                                options={contactOptions}
                            />
                        </Form>

                        {props.initial && <Button
                            variant="text"
                            onClick={() => setShowDelete(true)}
                            fullWidth
                            color="error">
                            Delete notification
                        </Button>}

                        <DeleteDialog title="Delete notification?"
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
