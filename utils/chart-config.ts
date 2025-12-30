
export interface DataDimension {
    key: string;
    label: string;
    name: string;
    formatter?: (value: number) => number;
}

export interface ChartConfig {
    dimension1?: DataDimension;
    dimension2?: DataDimension;
}

export const CHART_CONFIG: Record<string, ChartConfig> = {
    WEATHER: {
        dimension1: {
            key: "TEMPERATURE",
            name: "TEMPERATURE",
            label: "°F",
            formatter: (celsius) => Math.round((celsius * 9) / 5 + 32),
        },
        dimension2: {
            key: "HUMIDITY",
            name: "HUMIDITY",
            label: "%RH",
        },
    },
    MOISTURE: {
        dimension1: {
            key: "MOISTURE_PERCENT",
            name: "MOISTURE_PERCENT",
            label: "%",
        },
    },
    SCALE: {
        dimension1: {
            key: "WEIGHT",
            name: "WEIGHT",
            label: "g",
        },
    },
};