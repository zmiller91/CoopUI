import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { TimeTrigger } from "../../../client/rule";
import { getTimeOperatorSentenceFragment } from "../domain/time-operator";
import Emphasis from "../../../components/typography/emphasis";

export interface TimeConditionSentenceProps {
    trigger: TimeTrigger;
}

function formatTime(hour: number, minute: number): string | undefined {
    if (hour == null || minute == null || isNaN(hour) || isNaN(minute)) return undefined;
    const period = hour < 12 ? "AM" : "PM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

export default function TimeConditionSentence(props: TimeConditionSentenceProps) {
    const { trigger } = props;

    if (!trigger.operator) return null;

    const fragment = getTimeOperatorSentenceFragment(trigger.operator);
    const time = formatTime(trigger.hour, trigger.minute);

    if (!fragment || !time) return null;

    return (
        <Box
            sx={{
                mt: 1,
                px: 2,
                py: 1.25,
                borderRadius: 2,
                bgcolor: "action.hover",
                borderLeft: "4px solid",
                borderLeftColor: "primary.main",
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />

                <Typography variant="body2" color="text.secondary">
                    {"The time "}
                    {fragment}
                    {" "}
                    <Emphasis>{time}</Emphasis>
                </Typography>
            </Stack>
        </Box>
    );
}
