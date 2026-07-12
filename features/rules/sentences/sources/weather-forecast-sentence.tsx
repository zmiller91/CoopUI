import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {getOperatorSentenceFragment} from "../../domain/operator";
import {SourceSentenceProps} from "../source-sentence-props";
import Stack from "@mui/material/Stack";
import WaterDropOutlined from "@mui/icons-material/WaterDropOutlined";
import Emphasis from "../../../../components/typography/emphasis";

export default function WeatherForecastSentence(props: SourceSentenceProps) {

    if (!(props.signal && props.operator && props.threshold)) {
        return null;
    }

    if (props.signal != "RAIN_PROBABILITY_24H" && props.signal != "RAIN_AMOUNT_24H") {
        return null;
    }

    const fragment = props.signal == "RAIN_PROBABILITY_24H" ?
        "The chance of rain in the next 24h at " :
        "The amount of rain forecast in the next 24h at ";

    const label = props.signal == "RAIN_PROBABILITY_24H" ?
        "%" :
        "mm";

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
                <WaterDropOutlined
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
