'use client'

import * as React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import ruleClient, { RuleExecutionLogEntry } from "../../../client/rule";
import { formatRelativeDate } from "../../../utils/date";
import EmptyState from "./empty-state";

export interface RuleActivityProps {
    coopId: string;
    ruleId: string;
}

export default function RuleActivity(props: RuleActivityProps) {

    const [log, setLog] = useState<RuleExecutionLogEntry[]>([]);

    useEffect(() => {
        ruleClient.executionLog(props.coopId, props.ruleId, setLog);
    }, [props.coopId, props.ruleId]);

    return (
        <Card>
            <CardHeader sx={{ pb: 1 }} title={
                <Typography variant="subtitle1" fontWeight={600}>
                    Recent activity
                </Typography>
            }/>

            <CardContent>
                <Stack spacing={1.25}>

                    {log.length === 0 &&
                        <EmptyState message="No activity yet."/>
                    }

                    {log.map((entry, i) => (
                        <Stack key={i} direction="row" justifyContent="space-between" spacing={2}>
                            <Typography variant="body2">Triggered</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {formatRelativeDate(entry.createdAt)}
                            </Typography>
                        </Stack>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}
