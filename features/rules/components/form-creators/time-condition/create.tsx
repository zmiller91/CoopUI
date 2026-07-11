'use client';

import * as React from "react";
import Stack from "@mui/material/Stack";
import SelectInput from "../../../../../components/form/select";
import TextInput from "../../../../../components/form/text-input";
import { getTimeOperatorOptions } from "../../../domain/time-operator";
import TimeConditionSentence from "../../../sentences/time-condition-sentence";

export interface CreateTimeConditionProps {
    operator: string;
    setOperator: (operator: string) => void;
    hour: number;
    minute: number;
    setTime: (hour: number, minute: number) => void;
}

function toTimeValue(hour: number, minute: number): string {
    if (hour == null || minute == null || isNaN(hour) || isNaN(minute)) return "";
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export default function CreateTimeCondition(props: CreateTimeConditionProps) {

    const onTimeChange = (value: string) => {
        const [h, m] = value.split(":").map((v) => parseInt(v, 10));
        if (!isNaN(h) && !isNaN(m)) {
            props.setTime(h, m);
        }
    };

    return (
        <Stack spacing={2}>
            <SelectInput
                id="time-operator"
                title="Condition"
                placeholder="Select condition..."
                value={props.operator}
                onChange={props.setOperator}
                options={getTimeOperatorOptions()}
                required
            />

            <TextInput
                id="time-condition-time"
                title="Time"
                type="time"
                value={toTimeValue(props.hour, props.minute)}
                onChange={onTimeChange}
                required
            />

            <TimeConditionSentence
                trigger={{
                    operator: props.operator,
                    hour: props.hour,
                    minute: props.minute,
                }}
            />
        </Stack>
    );
}
