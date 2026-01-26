import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Form from "../../../components/form/form";
import {useEffect, useState} from "react";
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import DeleteDialog from "../../../components/dialog/delete";
import {Contact} from "../../../client/contact";
import TextInput from "../../../components/form/text-input";

export interface AddContactDialogProps {
    open: boolean,
    handleSubmit: (contact: Contact) => void;
    handleClose: () => void,
    handleDelete: () => void,
    initial?: Contact
}

export default function AddContactDialog(props: AddContactDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const[showDelete, setShowDelete] = useState(false)

    const [name, setName] = useState(props.initial?.displayName || '')
    const [email, setEmail] = useState(props.initial?.email || '')
    const [phone, setPhone] = useState(props.initial?.phone || '')

    const handleClose = () => {
        setName('');
        setEmail('');
        setPhone('');
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
        props.handleSubmit({
            id: props.initial?.id,
            displayName: name,
            email: email,
            phone: phone
        })

        handleClose();
    }

    useEffect(() => {
        if (!props.open) return;

        setName(props.initial?.displayName || "")
        setEmail(props.initial?.email || "")
        setPhone(props.initial?.phone || "")
    }, [props.open, props.initial]);

    return (
        <React.Fragment>

            <Dialog
                fullScreen={fullScreen}
                open={props.open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                disableRestoreFocus
            >
                <DialogTitle id="responsive-dialog-title">
                    {props.initial ? "Update " : "New"} Contact
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant="body2" color="text.secondary">
                            Choose the severity, delivery channels, and recipients.
                        </Typography>

                        <Form>

                            <TextInput id="name" title="Name" value={name} onChange={setName} required={true}/>
                            <TextInput id="email" title="E-mail" value={email} onChange={setEmail} required={false}/>
                            <TextInput id="phone" title="Phone Number" value={phone} onChange={setPhone} required={false}/>

                        </Form>

                        {props.initial && <Button
                            variant="text"
                            onClick={() => setShowDelete(true)}
                            fullWidth
                            color="error">
                            Delete contact
                        </Button>}

                        <DeleteDialog title="Delete contact?"
                                      onDelete={onDeleteConfirm}
                                      onCancel={onDeleteCancel}
                                      open={showDelete}/>

                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={onSubmit}>
                        {props.initial ? "Save" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>

    );
}
