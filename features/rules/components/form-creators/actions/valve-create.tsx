'use client';

import * as React from "react";
import Stack from "@mui/material/Stack";
import SelectInput, { SelectOption } from "../../../../../components/form/select";
import TextInput from "../../../../../components/form/text-input";
import { useMemo } from "react";
import ValveActionSentence from "../../../sentences/actions/valve-sentence";
import {CreateActionProps} from "../create-action-props";


export default ({
                    actionComponent,
                    actionKey,
                    setActionKey,
                    params,
                    setParams,
                }: CreateActionProps) => {

    const options: SelectOption[] = [
        { label: "Open valve", value: "TURN_ON" },
        { label: "Close valve", value: "TURN_OFF" },
    ];

    const needsDuration = useMemo(() => actionKey === "TURN_ON", [actionKey]);
    const duration = params.duration ?? "";

    return (
        <Stack spacing={2}>

            <SelectInput
                id="action"
                title="Action"
                placeholder="Select action..."
                value={actionKey}
                onChange={(k) => {
                    setActionKey(k);
                    if (k !== "TURN_ON") setParams({ duration: undefined });
                }}
                options={options}
                required
            />

            {needsDuration && (
                <TextInput
                    id="duration"
                    title="Duration (minutes)"
                    type="number"
                    value={duration}
                    onChange={(v) => setParams({ duration: v })}
                    required
                />
            )}

            <ValveActionSentence actuator={actionComponent} actionKey={actionKey} params={params} />

        </Stack>
    );
}
