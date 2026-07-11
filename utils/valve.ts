import { SelectOption } from "../components/form/select"

export const VALVE_ZONE_COUNT = 8

export const VALVE_ZONE_OPTIONS: SelectOption[] = Array.from({ length: VALVE_ZONE_COUNT }, (_, i) => i + 1).map((n) => ({
    label: `Zone ${n}`,
    value: String(n - 1),
}))
