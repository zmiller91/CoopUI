import { SelectOption } from "../../../components/form/select";

export interface Frequency {
    value: string;
    label: string;
}

function frequency(value: string, label: string): Frequency {
    return { value, label };
}

const DEFS: Record<string, Frequency> = {
    SUNDAY: frequency("SUNDAY", "Sunday"),
    MONDAY: frequency("MONDAY", "Monday"),
    TUESDAY: frequency("TUESDAY", "Tuesday"),
    WEDNESDAY: frequency("WEDNESDAY", "Wednesday"),
    THURSDAY: frequency("THURSDAY", "Thursday"),
    FRIDAY: frequency("FRIDAY", "Friday"),
    SATURDAY: frequency("SATURDAY", "Saturday"),
    DAY: frequency("DAY", "Every few days"),
    HOUR: frequency("HOUR", "Every few hours"),
};

const WEEKDAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

export function getFrequencyOptions(): SelectOption[] {
    return Object.values(DEFS).map((f) => ({
        label: f.label,
        value: f.value,
    }));
}

export function isWeekday(frequency: string): boolean {
    return WEEKDAYS.includes(frequency);
}

export function needsGap(frequency: string): boolean {
    return frequency === "DAY" || frequency === "HOUR";
}

export function getFrequencyLabel(frequency: string): string | undefined {
    return DEFS[frequency]?.label;
}

export default DEFS;
