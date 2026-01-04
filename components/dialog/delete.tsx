import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {DeleteOutline} from "@mui/icons-material";
import React, {ReactNode} from "react";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export interface DeleteDialogProps {
    title: string,
    children?: ReactNode,
    onDelete: () => void,
    onCancel: () => void,
    open: boolean
}

export default function DeleteDialog(props: DeleteDialogProps) {
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
                    color="error"
                    startIcon={<DeleteOutline />}
                    onClick={props.onDelete}
                >
                    Delete
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