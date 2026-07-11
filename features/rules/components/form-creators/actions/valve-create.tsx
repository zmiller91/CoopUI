'use client';

import * as React from "react";
import Stack from "@mui/material/Stack";
import SelectInput, { SelectOption } from "../../../../../components/form/select";
import TextInput from "../../../../../components/form/text-input";
import { useEffect, useMemo, useState } from "react";
import ValveActionSentence from "../../../sentences/actions/valve-sentence";
import {CreateActionProps} from "../create-action-props";
import { VALVE_ZONE_OPTIONS } from "../../../../../utils/valve";
import componentClient, { ComponentPort } from "../../../../../client/component";
import LoadingIndicator from "../../../../../components/loading-indicator";


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

    const [ports, setPorts] = useState<ComponentPort[]>([]);
    const [portsLoaded, setPortsLoaded] = useState(false);

    useEffect(() => {
        setPortsLoaded(false);

        if (!actionComponent?.id) {
            setPorts([]);
            setPortsLoaded(true);
            return;
        }

        componentClient.get(actionComponent.id, (c) => {
            setPorts(c.ports ?? []);
            setPortsLoaded(true);
        });
    }, [actionComponent?.id]);

    // Fall back to the generic "Zone N" label for any zone that hasn't been given a friendly name yet.
    // Nothing here renders until portsLoaded, so there's no flash from "Zone N" to the real name.
    const zoneOptions: SelectOption[] = useMemo(() =>
        VALVE_ZONE_OPTIONS.map((option) => {
            const port = ports.find((p) => String(p.index) === option.value);
            return port?.name ? { label: port.name, value: option.value } : option;
        }), [ports]);

    const needsDuration = useMemo(() => actionKey === "TURN_ON", [actionKey]);
    const duration = params.duration ?? "";
    const zone = params.zone ?? "";

    return (
        <Stack spacing={2}>

            <LoadingIndicator isLoading={!portsLoaded} hasAppBar={false} />

            <SelectInput
                id="action"
                title="Action"
                placeholder="Select action..."
                value={actionKey}
                onChange={(k) => {
                    setActionKey(k);
                    if (k !== "TURN_ON") setParams({ ...params, duration: undefined });
                }}
                options={options}
                required
            />

            {portsLoaded && (
                <SelectInput
                    id="zone"
                    title="Zone"
                    placeholder="Select zone..."
                    value={zone}
                    onChange={(v) => setParams({ ...params, zone: v })}
                    options={zoneOptions}
                    required
                />
            )}

            {needsDuration && (
                <TextInput
                    id="duration"
                    title="Duration (minutes)"
                    type="number"
                    value={duration}
                    onChange={(v) => setParams({ ...params, duration: v })}
                    required
                />
            )}

            {portsLoaded && (
                <ValveActionSentence
                    actuator={actionComponent}
                    actionKey={actionKey}
                    params={params}
                    zoneLabel={zoneOptions.find((o) => o.value === zone)?.label}
                />
            )}

        </Stack>
    );
}
