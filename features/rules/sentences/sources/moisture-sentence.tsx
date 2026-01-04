import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import {getOperatorSentenceFragment} from "../../domain/operator";
import {SourceSentenceProps} from "../source-sentence-props";
import Stack from "@mui/material/Stack";
import Emphasis from "../../../../components/typography/emphasis";

export function MoistureSentence(props: SourceSentenceProps) {

    if (!(props.signal && props.operator && props.threshold)) {
        return null;
    }

    if (props.signal != "MOISTURE_PERCENT") {
        return null;
    }

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
                <WaterDropOutlinedIcon
                    sx={{fontSize: 18, color: "primary.main"}}
                />

                <Typography variant="body2" color="text.secondary">
                    {"The moisture level of "}
                    <Emphasis>{props.sourceComponent.name}</Emphasis>
                    {" "}
                    {getOperatorSentenceFragment(props.operator)}
                    {" "}
                    <Emphasis>{props.threshold}%</Emphasis>
                </Typography>
            </Stack>
        </Box>
    );
}
