import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { ScheduleTrigger } from "../../../client/rule";
import { getFrequencyLabel, isWeekday } from "../domain/frequency";
import Emphasis from "../../../components/typography/emphasis";

export interface ScheduleSentenceProps {
    trigger: ScheduleTrigger;
}

function formatTime(hour: number, minute: number): string | undefined {
    if (hour == null || minute == null || isNaN(hour) || isNaN(minute)) return undefined;
    const period = hour < 12 ? "AM" : "PM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

function getRepeatFragment(trigger: ScheduleTrigger): string | undefined {
    const { frequency, gap } = trigger;
    if (!frequency) return undefined;

    if (isWeekday(frequency)) {
        return `Every ${getFrequencyLabel(frequency)}`;
    }

    if (frequency === "DAY") {
        return gap > 1 ? `Every ${gap} days` : "Every day";
    }

    if (frequency === "HOUR") {
        return gap > 1 ? `Every ${gap} hours` : "Every hour";
    }

    return undefined;
}

export default function ScheduleSentence(props: ScheduleSentenceProps) {
    const { trigger } = props;

    const repeatFragment = getRepeatFragment(trigger);
    const time = formatTime(trigger.hour, trigger.minute);

    if (!repeatFragment || (trigger.frequency !== "HOUR" && !time)) return null;

    return (
        <Box
            sx={{
                mt: 1,
                px: 2,
                py: 1.25,
                borderRadius: 2,
                bgcolor: "action.hover",
                borderLeft: "4px solid",
                borderLeftColor: "secondary.main",
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: "secondary.main" }} />

                <Typography variant="body2" color="text.secondary">
                    <Emphasis>{repeatFragment}</Emphasis>
                    {trigger.frequency === "HOUR"
                        ? <>{" at :"}<Emphasis>{String(trigger.minute ?? 0).padStart(2, "0")}</Emphasis></>
                        : <>{" at "}<Emphasis>{time}</Emphasis></>
                    }
                </Typography>
            </Stack>
        </Box>
    );
}
