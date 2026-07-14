import { ComponentType } from "react"
import { ComponentData, MetricInterval } from "../../client/data"
import ForecastComponentDetail from "./weather-forecast/forecast-component-detail"

export interface ComponentDetailContentProps {
    componentData: ComponentData;
    interval: MetricInterval;
    loading: boolean;
    onIntervalChange: (interval: MetricInterval) => void;
}

// Any componentType without an entry falls back to the generic chartConfig-driven tiles + Chart,
// defined in the single-sensor detail page itself (mirrors AREA_DETAIL_CONTENT_REGISTRY's fallback).
export const COMPONENT_DETAIL_REGISTRY: Record<string, ComponentType<ComponentDetailContentProps>> = {
    WEATHER_FORECAST: ForecastComponentDetail,
}
