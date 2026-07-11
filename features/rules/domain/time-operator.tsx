import { SelectOption } from "../../../components/form/select";

export interface TimeOperator {
    value: string;
    label: string;
    sentenceFragment: string;
}

function timeOperator(value: string, label: string, sentenceFragment: string): TimeOperator {
    return { value, label, sentenceFragment };
}

// Time conditions reuse the backend's Operator enum (LT/GT) so evaluation stays identical to a metric
// trigger's Operator.evaluate() - only "before"/"after" make sense for a continuous clock, so the UI
// exposes just these two.
const DEFS: Record<string, TimeOperator> = {
    LT: timeOperator("LT", "Before", "is before"),
    GT: timeOperator("GT", "After", "is after"),
};

export function getTimeOperatorOptions(): SelectOption[] {
    return Object.values(DEFS).map((o) => ({
        label: o.label,
        value: o.value,
    }));
}

export function getTimeOperatorSentenceFragment(operator: string): string | undefined {
    return DEFS[operator]?.sentenceFragment;
}

export default DEFS;
