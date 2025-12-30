import authClient from "./auth";

class RuleClient {

    create(coopId:string, rule: Rule, success: (response: Rule) => void) {
        authClient.post("/rule/create", {coopId, rule}, (response) => success(response.data.rule))
    }

    list(coopId:string, success: (response:Rule[]) => void) {
        authClient.get("/rule/" + coopId + "/list", (response) => success(response.data.rules))
    }
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
    action: string;
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
    threshold: number;
    operator: string;
    metric: string;
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