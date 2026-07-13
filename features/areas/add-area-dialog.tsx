import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Form from '../../components/form/form';
import SelectInput, { SelectOption } from '../../components/form/select';
import TextInput from '../../components/form/text-input';
import { Area } from '../../client/area';
import { getChildAreaTypeOptions } from './child-area-types';

export interface AddAreaDialogProps {
    open: boolean;
    handleSubmit: (area: Area) => void;
    handleClose: () => void;
    typeOptions?: SelectOption[];
}

export default function AddAreaDialog(props: AddAreaDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [type, setType] = useState('');
    const [name, setName] = useState('');

    const handleClose = () => {
        setType('');
        setName('');
        props.handleClose();
    };

    const onSubmit = () => {
        if (!name.trim() || !type) return;

        props.handleSubmit({
            name: name.trim(),
            type: type,
        });

        handleClose();
    };

    useEffect(() => {
        if (!props.open) return;

        setType('');
        setName('');
    }, [props.open]);

    const canSubmit = name.trim().length > 0 && !!type;

    return (
        <React.Fragment>

            <Dialog
                fullScreen={fullScreen}
                open={props.open}
                onClose={handleClose}
                aria-labelledby="add-group-dialog-title"
                disableRestoreFocus
            >
                <DialogTitle id="add-group-dialog-title">
                    New Group
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant="body2" color="text.secondary">
                            Groups let you organize devices by physical area - like a garden bed or the
                            chicken coop itself. Choosing a type helps tailor how this group is shown later;
                            pick &quot;Other&quot; if nothing fits yet.
                        </Typography>

                        <Form>
                            <SelectInput
                                id="type"
                                title="Type"
                                value={type}
                                onChange={setType}
                                options={props.typeOptions ?? getChildAreaTypeOptions()}
                                required
                            />

                            <TextInput id="name" title="Name" value={name} onChange={setName} required />
                        </Form>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={onSubmit} autoFocus>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>

    );
}
