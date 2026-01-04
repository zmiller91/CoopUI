import { SelectOption } from "../../../components/form/select";

export interface Operator {
    value: string;
    label: string;
    sentenceFragment: string;
}

function operator(
    value: string,
    label: string,
    sentenceFragment: string
): Operator {
    return { value, label, sentenceFragment };
}

const DEFS: Record<string, Operator> = {
    EQ: operator("EQ", "Equals", "is equal to"),
    GT: operator("GT", "Greater Than", "rises above"),
    LT: operator("LT", "Less Than", "falls below"),
    GTEQ: operator("GTEQ", "Greater Than or Equal To", "is at or above"),
    LTEQ: operator("LTEQ", "Less Than or Equal To", "is at or below"),
};

export function getOperatorOptions(): SelectOption[] {
    return Object.values(DEFS).map(o => ({
        label: o.label,
        value: o.value,
    }));
}

export function getOperatorSentenceFragment(operator: string): string | undefined {
    return DEFS[operator]?.sentenceFragment;
}

export function getOperator(operator: string): Operator | undefined {
    return DEFS[operator];
}

export default DEFS;
