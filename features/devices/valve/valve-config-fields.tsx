'use client';

import * as React from "react";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ComponentConfig } from "../../../client/component";

export interface ValveConfigFieldsProps {
    config: ComponentConfig[];
    setConfig: (updater: (previous: ComponentConfig[]) => ComponentConfig[]) => void;
}

function setValue(setConfig: ValveConfigFieldsProps["setConfig"], key: string, value: string) {
    setConfig((previous) => previous.map((c) => c.key === key ? { ...c, value } : c));
}

export default function ValveConfigFields({ config, setConfig }: ValveConfigFieldsProps) {

    const alwaysOn = config.find((c) => c.key === "always_on");

    return (
        <Stack spacing={2}>

            {alwaysOn && (
                <FormControlLabel
                    control={
                        <Switch
                            checked={alwaysOn.value === "true"}
                            onChange={(e) => setValue(setConfig, "always_on", e.target.checked ? "true" : "false")}
                        />
                    }
                    label={alwaysOn.name || "Always On"}
                />
            )}

        </Stack>
    );
}
