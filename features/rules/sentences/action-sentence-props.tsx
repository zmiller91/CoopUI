import {RuleComponent} from "../../../client/rule";

export interface ActionSentenceProps{
    actuator?: RuleComponent
    actionKey: string;
    params: Record<string, any>;
}