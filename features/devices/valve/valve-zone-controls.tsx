'use client';

import * as React from "react";
import { useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import componentClient, { ComponentPort } from "../../../client/component";
import { VALVE_ZONE_OPTIONS } from "../../../utils/valve";
import SnackBar from "../../../components/snack-bar";
import PortDetailDialog from "./port-detail-dialog";

export interface ValveZoneControlsProps {
    componentId: string;
    ports: ComponentPort[];
    onPortsChange: (ports: ComponentPort[]) => void;
}

function zoneName(ports: ComponentPort[], index: number, fallback: string) {
    return ports.find((p) => p.index === index)?.name || fallback;
}

function zoneState(ports: ComponentPort[], index: number) {
    return ports.find((p) => p.index === index)?.state === "ON" ? "ON" : "OFF";
}

export default function ValveZoneControls({ componentId, ports, onPortsChange }: ValveZoneControlsProps) {

    const [snackBarShowing, setSnackBarShowing] = useState(false);
    const [pending, setPending] = useState<string | null>(null);
    const [detailIndex, setDetailIndex] = useState<number | null>(null);

    function send(event: React.MouseEvent, zone: string, actionKey: "TURN_ON" | "TURN_OFF") {
        event.stopPropagation();
        const key = zone + actionKey;
        setPending(key);
        componentClient.manual(componentId, actionKey, zone, () => {
            setPending((current) => current === key ? null : current);
            setSnackBarShowing(true);
        });
    }

    function onPortSaved(port: ComponentPort) {
        const rest = ports.filter((p) => p.index !== port.index);
        onPortsChange([...rest, port]);
    }

    return (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ p: 2, pb: 1.5 }}>
                <Typography variant="subtitle1" fontWeight={700}>
                    Zones
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Turn a zone on or off right now, or tap it to rename, configure, or see its activity.
                </Typography>
            </Box>

            <List disablePadding>
                {VALVE_ZONE_OPTIONS.map((zoneOption, idx) => {
                    const zoneIndex = Number(zoneOption.value);
                    const name = zoneName(ports, zoneIndex, zoneOption.label);
                    const state = zoneState(ports, zoneIndex);

                    return (
                        <React.Fragment key={zoneOption.value}>
                            <ListItemButton
                                onClick={() => setDetailIndex(zoneIndex)}
                                sx={{
                                    py: 1.25,
                                    px: 2,
                                    minHeight: 64,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 2,
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 0, flex: 1 }}>
                                    <ListItemAvatar sx={{ minWidth: 0 }}>
                                        <Avatar
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                fontSize: 13,
                                                fontWeight: 700,
                                                bgcolor: "grey.200",
                                                color: "text.primary",
                                            }}
                                        >
                                            {zoneIndex + 1}
                                        </Avatar>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={name}
                                        primaryTypographyProps={{ variant: "body1", fontWeight: 600, noWrap: true }}
                                        sx={{ m: 0, minWidth: 0 }}
                                    />

                                    <Chip
                                        label={state === "ON" ? "On" : "Off"}
                                        size="small"
                                        variant={state === "ON" ? "filled" : "outlined"}
                                        sx={{
                                            flexShrink: 0,
                                            fontWeight: 700,
                                            ...(state === "ON"
                                                ? { bgcolor: "success.main", color: "success.contrastText" }
                                                : { borderColor: "divider", color: "text.secondary" }),
                                        }}
                                    />
                                </Stack>

                                <Stack direction="row" spacing={1} flexShrink={0}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        disabled={pending === zoneOption.value + "TURN_ON"}
                                        onClick={(e) => send(e, zoneOption.value, "TURN_ON")}
                                    >
                                        Turn On
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="inherit"
                                        sx={{ borderColor: "divider", color: "text.secondary" }}
                                        disabled={pending === zoneOption.value + "TURN_OFF"}
                                        onClick={(e) => send(e, zoneOption.value, "TURN_OFF")}
                                    >
                                        Turn Off
                                    </Button>
                                </Stack>
                            </ListItemButton>

                            {idx < VALVE_ZONE_OPTIONS.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                    );
                })}
            </List>

            <PortDetailDialog
                open={detailIndex !== null}
                componentId={componentId}
                portIndex={detailIndex}
                ports={ports}
                onClose={() => setDetailIndex(null)}
                onSaved={onPortSaved}
            />

            <SnackBar message="Command sent." display={snackBarShowing} callback={setSnackBarShowing}/>
        </Paper>
    );
}
