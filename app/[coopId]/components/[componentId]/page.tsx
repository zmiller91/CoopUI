'use client'

import componentClient, { Component, ComponentConfig } from "../../../../client/component";
import React, {useState, useEffect} from "react";
import { useParams } from "next/navigation";
import Form from "../../../../components/form/form";
import TextInput from "../../../../components/form/text-input";
import LoadingIndicator from "../../../../components/loading-indicator";
import { AppContent } from "../../../../components/app-content";
import SnackBar from "../../../../components/snack-bar";
import {usePageTitle} from "../../../../components/app-bar";
import ValveConfigFields from "../../../../features/devices/valve/valve-config-fields";
import ValveZoneControls from "../../../../features/devices/valve/valve-zone-controls";

import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function currentComponent():string {
    return useParams()["componentId"] as string;
}

export default function ComponentRegistry() {

    const componentId = currentComponent();
    const [component, setComponent] = useState({} as Component);
    const [config, setConfig] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [snackBarShowing, setSnackBarShowing] = useState(false);

    usePageTitle(component ? component.name : "Component");
    useEffect(() => {
        componentClient.get(componentId, (c) => {
            setComponent(c);
            setConfig(c.config)
            setHasLoaded(true);
        })
    }, [])

    function update() {
        setIsSaving(true);
        componentClient.post(componentId, config, () => {
            setIsSaving(false);
            setSnackBarShowing(true);
        });
    }

    function onChange(value, event) {

        setConfig((previousConfig) => {
            const newConfig = ([...previousConfig] as ComponentConfig[])
            for(var idx in newConfig) {
                const cfg = newConfig[idx]
                if(cfg.key === event.target.id) {
                    cfg.value = value
                }
            }

            return newConfig
        })
    }

    const configEditors: Record<string, React.ReactNode> = {
        "VALVE": <ValveConfigFields config={config} setConfig={setConfig} />,
    };

    const deviceControls: Record<string, React.ReactNode> = {
        "VALVE": <ValveZoneControls
            componentId={componentId}
            ports={component.ports ?? []}
            onPortsChange={(ports) => setComponent((previous) => ({ ...previous, ports }))}
        />,
    };

    return (
        <div>
            <LoadingIndicator isLoading={isSaving}/>
            <AppContent hasLoaded={hasLoaded}>
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="h6" fontWeight={700} noWrap>
                            {component.name || "Component"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                            {component.type ? `${component.serial} • ${component.type}` : component.serial}
                        </Typography>
                    </Box>

                    <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                        <Typography variant="subtitle1" fontWeight={700}>
                            Configuration
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Settings this device uses to decide how to behave.
                        </Typography>

                        <Form submitText="Save" onSubmit={update}>
                            {configEditors[component.type] ?? config?.map((c, idx) => {
                                return <TextInput key={idx} id={c.key} title={c.name} value={config[idx].value} onChange={onChange} required={true}/>
                            })}
                        </Form>
                    </Paper>

                    {deviceControls[component.type]}
                </Stack>
            </AppContent>
            <SnackBar message="Component updated." display={snackBarShowing} callback={setSnackBarShowing}/>
        </div>
    )
}