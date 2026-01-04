'use client'

import ruleClient from "../../../client/rule";
import React, {useEffect, useState} from "react";
import {currentCoop} from "../coop-context"
import { useRouter } from 'next/navigation'
import { AppContent } from "../../../components/app-content";
import {usePageTitle} from "../../../components/app-bar";
import FloatingActionButton from "../../../components/fab";

import {
    Box,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    Button
} from "@mui/material";

import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";

type RuleListItem = {
    id?: string;
    name: string;
    // optional future fields:
    // enabled?: boolean;
    // triggersCount?: number;
    // actionsCount?: number;
};

export default function Rules() {
    usePageTitle("Automations")

    const [hasLoaded, setHasLoaded] = useState(false);
    const [rules, setRules] = useState<RuleListItem[]>([]);
    const coopId = currentCoop();
    const router = useRouter();

    useEffect(() => {
        ruleClient.listRules(coopId, (rules: RuleListItem[]) => {
            setRules(rules ?? []);
            setHasLoaded(true);
        })
    }, []);

    function goCreate() {
        router.push("rules/register");
    }

    function goRule(rule: RuleListItem) {
        // If you have a details route, use it:
        if (rule.id) router.push(`rules/${rule.id}`);
        // otherwise fallback to edit route:
        // router.push(`rules/register?edit=${rule.id}`)
    }

    return (
        <AppContent hasLoaded={hasLoaded}>
            <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                    Automations run automatically when their conditions are met.
                </Typography>

                {rules.length === 0 ? (
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent>
                            <Box
                                sx={{
                                    border: "1.5px dashed",
                                    borderColor: "divider",
                                    borderRadius: 2,
                                    p: 2,
                                    bgcolor: "action.hover",
                                    textAlign: "center",
                                }}
                            >
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    No automations yet
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Create one to automate chores like watering, vents, and alerts.
                                </Typography>

                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={goCreate}
                                    sx={{ mt: 2 }}
                                >
                                    Create automation
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ) : (
                    <Card variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
                        <List disablePadding>
                            {rules.map((r, idx) => (
                                <React.Fragment key={r.id ?? `${r.name}-${idx}`}>
                                    <ListItem disablePadding>
                                        <ListItemButton onClick={() => goRule(r)} sx={{ py: 1.25 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <BoltOutlinedIcon color="action" />
                                            </ListItemIcon>

                                            <ListItemText
                                                primary={
                                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                        {r.name}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography variant="body2" color="text.secondary">
                                                        Tap to view or edit
                                                        {/* If you later have counts, replace with:
                                {`${r.triggersCount} conditions • ${r.actionsCount} actions`}
                             */}
                                                    </Typography>
                                                }
                                            />

                                            <ChevronRightIcon color="action" />
                                        </ListItemButton>
                                    </ListItem>
                                    {idx < rules.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Card>
                )}
            </Stack>

            <FloatingActionButton onClick={goCreate}>
                <AddIcon sx={{ fontSize: 20 }} />
            </FloatingActionButton>
        </AppContent>
    )
}
