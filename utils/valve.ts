import { SelectOption } from "../components/form/select"

export const VALVE_ZONE_COUNT = 8

export function defaultZoneName(index: number): string {
    return `Zone ${index + 1}`
}

export const VALVE_ZONE_OPTIONS: SelectOption[] = Array.from({ length: VALVE_ZONE_COUNT }, (_, index) => ({
    label: defaultZoneName(index),
    value: String(index),
}))
