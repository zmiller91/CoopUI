import {RuleComponent} from "../../../../client/rule";

export interface CreateActionProps {
    actionComponent?: RuleComponent;
    actionKey: string;
    setActionKey: (k: string) => void;
    params: Record<string, any>;
    setParams: (patch: Record<string, any>) => void;
}