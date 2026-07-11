'use client';

import * as React from "react";
import Stack from "@mui/material/Stack";
import SelectInput from "../../../../../components/form/select";
import TextInput from "../../../../../components/form/text-input";
import { getFrequencyOptions, needsGap } from "../../../domain/frequency";
import ScheduleSentence from "../../../sentences/schedule-sentence";

export interface CreateScheduleProps {
    frequency: string;
    setFrequency: (frequency: string) => void;
    hour: number;
    minute: number;
    setTime: (hour: number, minute: number) => void;
    gap: string;
    setGap: (gap: string) => void;
}

function toTimeValue(hour: number, minute: number): string {
    if (hour == null || minute == null || isNaN(hour) || isNaN(minute)) return "";
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export default function CreateSchedule(props: CreateScheduleProps) {

    const onTimeChange = (value: string) => {
        const [h, m] = value.split(":").map((v) => parseInt(v, 10));
        if (!isNaN(h) && !isNaN(m)) {
            props.setTime(h, m);
        }
    };

    return (
        <Stack spacing={2}>
            <SelectInput
                id="frequency"
                title="Repeats"
                placeholder="Select frequency..."
                value={props.frequency}
                onChange={props.setFrequency}
                options={getFrequencyOptions()}
                required
            />

            <TextInput
                id="time"
                title="Time"
                type="time"
                value={toTimeValue(props.hour, props.minute)}
                onChange={onTimeChange}
                required
            />

            {needsGap(props.frequency) && (
                <TextInput
                    id="gap"
                    title={props.frequency === "HOUR" ? "Every N hours" : "Every N days"}
                    type="number"
                    value={props.gap}
                    onChange={props.setGap}
                    required
                />
            )}

            <ScheduleSentence
                trigger={{
                    frequency: props.frequency,
                    hour: props.hour,
                    minute: props.minute,
                    gap: parseInt(props.gap, 10) || 1,
                }}
            />
        </Stack>
    );
}
