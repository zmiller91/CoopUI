import React, { useState } from "react";
import { TextField } from "@mui/material";

export interface TextInputProps {
    id: string;
    title: string;
    value: any;
    onChange: (value: any, event?: any) => void;
    type?: string;
    required?: boolean;
    disabled?: boolean;
}

export default function TextInput(props: TextInputProps) {
    const [showInvalid, setShowInvalid] = useState(false);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (showInvalid) setShowInvalid(false);
        props.onChange(event.target.value, event);
    }

    return (
        <TextField
            id={props.id}
            name={props.id}
            label={props.title}
            type={props.type ?? "text"}
            value={props.value ?? ""}
            onChange={handleChange}
            required={props.required}
            disabled={props.disabled}
            fullWidth
            margin="dense"
            size="small"
            error={showInvalid}
            helperText={showInvalid ? `${props.title} is required.` : undefined}
            inputProps={{
                // Keep native validation so onInvalid fires
                required: props.required,
            }}
            onInvalid={(e) => {
                // Prevent browser tooltip bubble so MUI helperText is the message
                e.preventDefault();
                setShowInvalid(true);
            }}
        />
    );
}
