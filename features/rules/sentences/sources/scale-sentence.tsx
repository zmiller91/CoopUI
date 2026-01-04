import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {getOperatorSentenceFragment} from "../../domain/operator";
import {SourceSentenceProps} from "../source-sentence-props";
import Stack from "@mui/material/Stack";
import ScaleOutlined from "@mui/icons-material/ScaleOutlined";
import Emphasis from "../../../../components/typography/emphasis";

export default function ScaleSentence(props: SourceSentenceProps) {

    if (!(props.signal && props.operator && props.threshold)) {
        return null;
    }

    if (props.signal != "WEIGHT") {
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
                <ScaleOutlined
                    sx={{fontSize: 18, color: "primary.main"}}
                />

                <Typography variant="body2" color="text.secondary">
                    {"The weight of "}
                    <Emphasis>{props.sourceComponent.name}</Emphasis>
                    {" "}
                    {getOperatorSentenceFragment(props.operator)}
                    {" "}
                    <Emphasis>{props.threshold} grams</Emphasis>
                </Typography>
            </Stack>
        </Box>
    );
}
