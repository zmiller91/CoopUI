'use client';

import * as React from "react";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import TextInput from "../../../components/form/text-input";
import componentClient, { ComponentConfig, ComponentPort, PortLogEntry } from "../../../client/component";
import { formatEventTime } from "../../../utils/date";

export interface PortDetailDialogProps {
    open: boolean;
    componentId: string;
    portIndex: number | null;
    ports: ComponentPort[];
    onClose: () => void;
    onSaved: (port: ComponentPort) => void;
}

function fallbackName(index: number) {
    return `Zone ${index + 1}`;
}

function describeEntry(entry: PortLogEntry): string {
    const isOn = entry.actionKey === "TURN_ON";

    switch (entry.status) {
        case "REQUESTED":
            return `Requested ${isOn ? "on" : "off"} · ${entry.source === "RULE" ? "automation" : "manual"}`;
        case "COMPLETE":
            return `Turned ${isOn ? "on" : "off"}`;
        case "FAILED":
            return `Failed to turn ${isOn ? "on" : "off"}`;
        case "CANCELLED":
            return "Cancelled (superseded by a newer request)";
        default:
            return entry.status;
    }
}

export default function PortDetailDialog({ open, componentId, portIndex, ports, onClose, onSaved }: PortDetailDialogProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [name, setName] = useState("");
    const [config, setConfig] = useState<ComponentConfig[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [log, setLog] = useState<PortLogEntry[]>([]);

    useEffect(() => {
        if (!open || portIndex === null) return;
        const port = ports.find((p) => p.index === portIndex);
        setName(port?.name || fallbackName(portIndex));
        setConfig(port?.config ?? []);
        setLog([]);
        componentClient.portLog(componentId, portIndex, setLog);
    }, [open, portIndex, ports]);

    function configValue(key: string) {
        return config.find((c) => c.key === key)?.value ?? "";
    }

    function setConfigValue(key: string, value: string) {
        setConfig((previous) => previous.some((c) => c.key === key)
            ? previous.map((c) => c.key === key ? { ...c, value } : c)
            : [...previous, { key, value, name: key }]);
    }

    function save() {
        if (portIndex === null) return;
        setIsSaving(true);
        componentClient.savePorts(componentId, [{ index: portIndex, name, config }], () => {
            setIsSaving(false);
            onSaved({ index: portIndex, name });
            onClose();
        });
    }

    if (portIndex === null) {
        return null;
    }

    return (
        <Dialog fullScreen={fullScreen} open={open} onClose={onClose} aria-labelledby="port-detail-title">
            <DialogTitle id="port-detail-title">
                {name || fallbackName(portIndex)}
                <Typography variant="body2" color="text.secondary">
                    Zone {portIndex + 1}
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Stack spacing={2} sx={{ pt: 1 }}>
                    <TextInput id="name" title="Name" value={name} onChange={setName} required />
                    <TextInput
                        id="default_duration"
                        title="Default Duration (minutes)"
                        type="number"
                        value={configValue("default_duration")}
                        onChange={(v) => setConfigValue("default_duration", v)}
                        required
                    />
                    <TextInput
                        id="manual_cutoff"
                        title="Manual Cutoff (minutes)"
                        type="number"
                        value={configValue("manual_cutoff")}
                        onChange={(v) => setConfigValue("manual_cutoff", v)}
                        required
                    />

                    <Divider />

                    <Stack spacing={1}>
                        <Typography variant="subtitle2" fontWeight={700}>
                            Activity
                        </Typography>

                        {log.length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                                No activity yet.
                            </Typography>
                        )}

                        {log.map((entry, idx) => (
                            <Stack key={idx} direction="row" justifyContent="space-between" spacing={2}>
                                <Typography variant="body2">{describeEntry(entry)}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {formatEventTime(entry.createdAt)}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={save} disabled={isSaving}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}
