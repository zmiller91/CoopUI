import authClient from "./auth";

class RuleClient {

    create(coopId:string, rule: Rule, success: (response: Rule) => void) {
        authClient.post("/rule/create", {coopId, rule}, (response) => success(response.data.rule))
    }

    listRuleSources(coopId: string, success:(response: ListRuleSourcesResponse) => void) {
        authClient.get("/rule/" + coopId + "/rulesources/list",
            (response) => success(response.data))

    }

    listActuators(coopId: string, success:(response: ListRuleActuatorResponse) => void) {
        authClient.get("/rule/" + coopId + "/actuators/list",
            (response) => success(response.data))

    }

    listRules(coopId:string, success: (response:Rule[]) => void) {
        authClient.get("/rule/" + coopId + "/list", (response) => success(response.data.rules))
    }

    getRule(coopId:string, ruleId:string, success: (response:Rule) => void) {
        authClient.get("/rule/" + coopId + "/" + ruleId, (response) => success(response.data.rule))
    }

    updateRule(coopId:string, ruleId:string, request: UpdateRuleRequest, success: () => void) {
        authClient.put("/rule/" + coopId + "/" + ruleId, request, () => success())
    }

    deleteRule(coopId:string, ruleId:string, success: () => void) {
        authClient.delete("/rule/" + coopId + "/" + ruleId, () => success())
    }
}

export interface UpdateRuleRequest{
    rule: Rule
}

export interface ActuatorActions {
    key: string,
    displayName: string,
    description: string,
    params: string[]
}

export interface Actuator {
    actions: ActuatorActions[]
}

export interface ListRuleActuatorResponse {
    components: RuleComponent[],
    actions: Record<string, Actuator>

}

export interface Signal {
    key: string,
    displayName: string,
    description: string
}

export interface Source {
    signals: Signal[]
}

export interface ListRuleSourcesResponse {
    components: RuleComponent[],
    sources: Record<string, Source>
}

interface CreateRuleRequest {
    coopId: string,
    rule: Rule
}

export interface RuleComponent {
    id: string;
    name?: string;
    serialNumber?: string;
    type?: string;
}

export interface RuleAction {
    id?: string;
    component: RuleComponent;
    actionKey: string;
    params: Record<string, string>
}

export interface ScheduleTrigger {
    id?: string;
    frequency: string;
    hour: number;
    minute: number;
    gap: number;
}

export interface ComponentTrigger {
    id?: string;
    component: RuleComponent;
    signal: string;
    threshold: string;
    operator: string;
}

export interface Rule {
    id?: string;
    name: string;
    status?: string;
    componentTriggers?: ComponentTrigger[];
    scheduleTriggers?: ScheduleTrigger[];
    actions: RuleAction[];
}

export default new RuleClient();