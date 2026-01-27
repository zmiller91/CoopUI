import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {useEffect, useState} from "react";
import {Box, IconButton, Stack, Typography} from "@mui/material";
import {InboxMessage} from "../../client/inbox";
import Paper from "@mui/material/Paper";
import DeleteDialog from "../../components/dialog/delete";
import Chip from "@mui/material/Chip";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {formatDateToFriendlyString} from "../../utils/date";

export interface InboxMessageDialogProps {
    open: boolean,
    handleClose: () => void,
    handleDelete: () => void,
    message: InboxMessage
}

function severityChipColor(sev?: string): 'default' | 'warning' | 'error' | 'info' {
    switch ((sev || '').toUpperCase()) {
        case 'CRITICAL':
            return 'error'
        case 'WARN':
        case 'WARNING':
            return 'warning'
        case 'INFO':
            return 'info'
        default:
            return 'default'
    }
}

export default function InboxMessageDialog(props: InboxMessageDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const[showDelete, setShowDelete] = useState(false)

    const handleClose = () => {
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
        handleClose();
    }

    useEffect(() => {
        if (!props.open) return;
    }, [props.open]);

    return (
        <React.Fragment>

            <Dialog
                fullScreen={fullScreen}
                open={props.open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                disableRestoreFocus
            >
                <DialogTitle
                    id="inbox-message-title"
                    sx={{
                        pr: 6,
                        pb: 1,
                    }}
                >
                    <Typography fontWeight={800} sx={{ lineHeight: 1.2 }}>
                        {props.message?.subject || 'Message'}
                    </Typography>

                    {/* Meta row */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>

                        <Typography variant="caption" color="text.secondary">
                            {props.message ? formatDateToFriendlyString(props.message.createdTs) : ""}
                        </Typography>

                        <Chip
                            size="small"
                            label={(props.message?.severity || 'INFO').toUpperCase()}
                            color={severityChipColor(props.message?.severity)}
                            variant="outlined"
                        />

                        <IconButton
                            aria-label="Close"
                            onClick={handleClose}
                            sx={{ position: 'absolute', right: 12, top: 12 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2}>

                        <Box sx={{ p: 2 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    lineHeight: 1.6,
                                }}
                            >
                                {props.message?.bodyText}
                            </Typography>
                        </Box>

                        <Button
                            variant="text"
                            onClick={() => setShowDelete(true)}
                            fullWidth
                            color="error">
                            Delete message
                        </Button>

                        <DeleteDialog title="Delete message?"
                                      onDelete={onDeleteConfirm}
                                      onCancel={onDeleteCancel}
                                      open={showDelete}/>

                    </Stack>
                </DialogContent>
            </Dialog>
        </React.Fragment>

    );
}
