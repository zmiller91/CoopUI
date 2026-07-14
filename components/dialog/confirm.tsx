import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {CheckCircleOutline} from "@mui/icons-material";
import React, {ReactNode} from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export interface ConfirmDialogProps {
    title: string,
    children?: ReactNode,
    onConfirm: () => void,
    onCancel: () => void,
    open: boolean,
    // Generic by default ("Confirm" / a checkmark / primary) - callers that need delete-specific styling
    // (label "Delete", DeleteOutline icon, error color) pass these explicitly rather than relying on a
    // delete-flavored default for a component that isn't exclusively about deleting.
    confirmLabel?: string,
    confirmIcon?: ReactNode,
    confirmColor?: 'error' | 'primary',
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Dialog
            fullScreen={fullScreen}
            open={props.open}
            aria-labelledby="responsive-dialog-title">

            <DialogTitle id="responsive-dialog-title">
                {props.title}
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                {props.children}
            </DialogContent>

            <DialogActions
                sx={{
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    gap: 1,
                    px: 3,
                    pb: 2,
                }}
            >
                <Button
                    variant="contained"
                    color={props.confirmColor ?? 'primary'}
                    startIcon={props.confirmIcon ?? <CheckCircleOutline />}
                    onClick={props.onConfirm}
                >
                    {props.confirmLabel ?? 'Confirm'}
                </Button>

                <Button
                    variant="text"
                    onClick={props.onCancel}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>


    )
}