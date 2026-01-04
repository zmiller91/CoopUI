'use client';

import * as React from "react";
import Stack from "@mui/material/Stack";
import SelectInput, { SelectOption } from "../../../../../components/form/select";
import TextInput from "../../../../../components/form/text-input";
import {RuleComponent} from "../../../../../client/rule";
import {getOperatorOptions} from "../../../domain/operator";
import getSourceSentence from "../../../sentences/get-source-sentence";

export interface CreateSourceProps {
    sourceComponent: RuleComponent,
    signal: string;
    setSignal: (signal: string) => void,
    threshold: string,
    setThreshold: (threshold: string) => void,
    operator: string,
    setOperator: (operator: string) => void,
    options: SelectOption[]
}


export default function CreateSource(props: CreateSourceProps) {

    return (
        <Stack spacing={2}>
            <SelectInput
                id="signal"
                title="Signal"
                placeholder="Select signal..."
                value={props.signal}
                onChange={props.setSignal}
                options={props.options}
                required
            />

            <SelectInput
                id="operator"
                title="Operator"
                placeholder="Select operator..."
                value={props.operator}
                onChange={props.setOperator}
                options={getOperatorOptions()}
                required
            />

            <TextInput
                id="threshold"
                title="Threshold"
                type="number"
                value={props.threshold}
                onChange={props.setThreshold}
                required
            />

            {
                <React.Fragment key="source-sentence">
                    {getSourceSentence(props.sourceComponent.type, {
                        sourceComponent: props.sourceComponent,
                        signal: props.signal,
                        operator: props.operator,
                        threshold: props.threshold
                    })}
                </React.Fragment>
            }
        </Stack>
    );
}
