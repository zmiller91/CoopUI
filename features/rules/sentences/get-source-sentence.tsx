import * as React from "react";
import {SourceSentenceProps} from "./source-sentence-props";
import {MoistureSentence} from "./sources/moisture-sentence";
import WeatherSentence from "./sources/weather-sentence";
import ScaleSentence from "./sources/scale-sentence";

export default function getSourceSentence(sourceComponentDeviceType: string, props: SourceSentenceProps) {

    const sentences = {
        "MOISTURE": <MoistureSentence {...props} />,
        "WEATHER": <WeatherSentence {...props} />,
        "SCALE": <ScaleSentence {...props} />
    }

    return sentences[sourceComponentDeviceType]

}