import React, {useEffect, useMemo, useState} from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    SelectChangeEvent, Checkbox, ListItemText,
} from "@mui/material";
import {SelectOption} from "./select";


export interface MultiSelectInputProps {
    id: string;
    title: string;
    values: any[];
    onChange: (value: any[]) => void;
    options: SelectOption[];
    required?: boolean;
    disabled?: boolean;
    helperText?: string;
    error?: boolean;
}

export default function MultiSelectInput(props: MultiSelectInputProps) {

    const [selectedStrings, setSelectedStrings] = useState([]);

    useEffect(() => {

        const hasValue = props.values && props.values.length > 0;
        if(hasValue) {
            setSelectedStrings(props.values)
        }
    }, [props.values]);

    function handleChange(event: SelectChangeEvent<string[]>) {
        const raw = event.target.value;
        const selected = Array.isArray(raw) ? raw : String(raw).split(",");

        const nextValues = selected
            .map((s) => props.options.find((o) => String(o.value) === s)?.value)
            .filter((v) => v !== undefined);

        setSelectedStrings(nextValues);
        props.onChange(nextValues);
    }

    const renderValue = (selected: string[]) => {
        const labels = selected.map(s => props.options.find(option => option.value === s)?.label ?? s)
        if (labels.length <= 2) return labels.join(", ");

        const shown = labels.slice(0, 2).join(", ");
        const more = labels.length - 2;
        return `${shown} +${more}`;
    }

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
            >
                {props.title}
            </InputLabel>

            <Select<string[]>
                labelId={`${props.id}-label`}
                id={props.id}
                multiple
                value={selectedStrings}
                label={props.title}
                onChange={handleChange}
                renderValue={renderValue}
            >

                {props.options.map((opt) => {
                    const optString = String(opt.value);
                    const checked = selectedStrings.includes(optString);

                    return (
                        <MenuItem key={optString} value={optString}>
                            <Checkbox checked={checked} />
                            <ListItemText primary={opt.label} />
                        </MenuItem>
                    );
                })}


            </Select>

            {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
        </FormControl>
    );
}
