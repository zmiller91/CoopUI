import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {getOperatorSentenceFragment} from "../../domain/operator";
import {SourceSentenceProps} from "../source-sentence-props";
import Stack from "@mui/material/Stack";
import DeviceThermostatOutlined from "@mui/icons-material/DeviceThermostatOutlined";
import Emphasis from "../../../../components/typography/emphasis";

export default function WeatherSentence(props: SourceSentenceProps) {

    if (!(props.signal && props.operator && props.threshold)) {
        return null;
    }

    if (props.signal != "HUMIDITY" && props.signal != "TEMPERATURE") {
        return null;
    }

    const fragment = props.signal == "HUMIDITY" ?
        "The humidity level at " :
        "The temperature at ";

    const label = props.signal == "HUMIDITY" ?
        "%" :
        "°F";

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
                <DeviceThermostatOutlined
                    sx={{fontSize: 18, color: "primary.main"}}
                />

                <Typography variant="body2" color="text.secondary">
                    {fragment}
                    <Emphasis>{props.sourceComponent.name}</Emphasis>
                    {" "}
                    {getOperatorSentenceFragment(props.operator)}
                    {" "}
                    <Emphasis>{props.threshold + label}</Emphasis>
                </Typography>
            </Stack>


        </Box>
    );
}
