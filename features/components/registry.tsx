import { ComponentType } from "react"
import { ComponentData, MetricInterval } from "../../client/data"
import ForecastComponentDetail from "./weather-forecast/forecast-component-detail"
import GenericComponentDetail from "./generic-component-detail"

export interface ComponentDetailContentProps {
    componentData: ComponentData;
    interval: MetricInterval;
    loading: boolean;
    onIntervalChange: (interval: MetricInterval) => void;
}

class ComponentDetailRegistry {
    private readonly components: Record<string, ComponentType<ComponentDetailContentProps>> = {
        WEATHER_FORECAST: ForecastComponentDetail,
    }

    get(type: string | undefined): ComponentType<ComponentDetailContentProps> {
        return (type && this.components[type]) ?? GenericComponentDetail
    }
}
export const COMPONENT_DETAIL_REGISTRY = new ComponentDetailRegistry()
