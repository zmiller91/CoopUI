import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { ActionSentenceProps } from "../action-sentence-props";
import Emphasis from "../../../../components/typography/emphasis";

export default function ValveActionSentence(props: ActionSentenceProps) {
    if (!props.actuator || !props.actionKey) return null;

    const isOn = props.actionKey === "TURN_ON";
    const hasDuration = isOn && props.params?.duration;

    if (isOn && !hasDuration) return null;

    return (
        <Box
            sx={{
                mt: 1,
                px: 2,
                py: 1.25,
                borderRadius: 2,
                bgcolor: "action.hover",
                borderLeft: "4px solid",
                borderLeftColor: isOn ? "success.main" : "text.secondary",
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center">

                {isOn &&
                    <Typography variant="body2" color="text.secondary">
                        {"Turn on "}
                        <Emphasis>{props.actuator.name}</Emphasis>
                        {" for "}
                        <Emphasis>{props.params.duration}</Emphasis>
                        {" minutes"}
                    </Typography>
                }

                {!isOn &&
                    <Typography variant="body2" color="text.secondary">
                        {"Turn off "}
                        <Emphasis>{props.actuator.name}</Emphasis>
                    </Typography>
                }
            </Stack>
        </Box>
    );
}
