import * as React from "react";
import {ActionSentenceProps} from "./action-sentence-props";
import ValveActionSentence from "./actions/valve-sentence";

export default function getActionSentence(actionComponentDeviceType: string, props: ActionSentenceProps) {

    const sentences = {
        "VALVE": <ValveActionSentence {...props} />
    }

    return sentences[actionComponentDeviceType]

}