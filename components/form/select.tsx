import React, { useEffect } from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    SelectChangeEvent,
} from "@mui/material";

export type SelectOption = {
    label: string;
    value: any;
};

export interface SelectInputProps {
    id: string;
    title: string;
    value: any;
    onChange: (value: any) => void;
    options: SelectOption[];
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    helperText?: string;
    error?: boolean;
}

export default function SelectInput(props: SelectInputProps) {
    const emptyValue = "";
    const hasPlaceholder = !!props.placeholder;

    useEffect(() => {
        if (!hasPlaceholder) {
            const hasValue =
                props.value !== undefined &&
                props.value !== null &&
                String(props.value) !== emptyValue;

            if (!hasValue && props.options.length > 0) {
                props.onChange(props.options[0].value);
            }
        }
    }, [hasPlaceholder, props.options, props.value, props.onChange]);

    function handleChange(event: SelectChangeEvent<string>) {
        const raw = event.target.value;
        const matched = props.options.find((o) => String(o.value) === raw);
        props.onChange(matched ? matched.value : raw);
    }

    const selectValue =
        props.value === undefined || props.value === null ? emptyValue : String(props.value);

    return (
        <FormControl
            fullWidth
            margin="dense"
            required={props.required}
            disabled={props.disabled}
            error={props.error}
            size="small"
        >
            <InputLabel
                id={`${props.id}-label`}
                // ✅ This prevents "Select" from overlapping the placeholder
                shrink={hasPlaceholder || selectValue !== emptyValue}
            >
                {props.title}
            </InputLabel>

            <Select
                labelId={`${props.id}-label`}
                id={props.id}
                value={selectValue}
                label={props.title}
                onChange={handleChange}
                displayEmpty={hasPlaceholder}
            >
                {hasPlaceholder && (
                    <MenuItem value={emptyValue} disabled>
                        {props.placeholder}
                    </MenuItem>
                )}

                {props.options.map((opt) => (
                    <MenuItem key={String(opt.value)} value={String(opt.value)}>
                        {opt.label}
                    </MenuItem>
                ))}
            </Select>

            {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
        </FormControl>
    );
}
