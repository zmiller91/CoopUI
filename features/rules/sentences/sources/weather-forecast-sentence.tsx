import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {getOperatorSentenceFragment} from "../../domain/operator";
import {SourceSentenceProps} from "../source-sentence-props";
import Stack from "@mui/material/Stack";
import WaterDropOutlined from "@mui/icons-material/WaterDropOutlined";
import Emphasis from "../../../../components/typography/emphasis";

const SIGNAL_INFO: Record<string, { fragment: string; unit: string }> = {
    RAIN_PROBABILITY_24H: { fragment: "The chance of rain in the next 24h at ", unit: "%" },
    RAIN_AMOUNT_24H: { fragment: "The amount of rain forecast in the next 24h at ", unit: "mm" },
    TEMPERATURE: { fragment: "The forecasted temperature at ", unit: "°F" },
    HUMIDITY: { fragment: "The forecasted humidity at ", unit: "%" },
    WIND_SPEED: { fragment: "The forecasted wind speed at ", unit: "mph" },
    CLOUD_COVER: { fragment: "The forecasted cloud cover at ", unit: "%" },
    EVAPOTRANSPIRATION: { fragment: "The forecasted evapotranspiration at ", unit: "mm" },
    DEW_POINT: { fragment: "The forecasted dew point at ", unit: "°F" },
    UV_INDEX: { fragment: "The forecasted UV index at ", unit: "" },
};

export default function WeatherForecastSentence(props: SourceSentenceProps) {

    if (!(props.signal && props.operator && props.threshold)) {
        return null;
    }

    const info = SIGNAL_INFO[props.signal];
    if (!info) {
        return null;
    }

    const {fragment, unit: label} = info;

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
