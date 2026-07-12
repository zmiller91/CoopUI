
import authClient from "./auth"

class ComponentClient {

    register(coopId: string, serialNumber:string, name:string, success: (response:any) => void) {
        const data = {
            coopId: coopId,
            serialNumber: serialNumber,
            name: name
        }

        authClient.post("/component/register", data, (response) => success(response.data))
    }

    registerWeatherForecast(coopId: string, success: (response:any) => void) {
        authClient.post("/component/" + coopId + "/weather-forecast", {}, (response) => success(response.data))
    }

    get(componentId:string, success: (response:Component) => void) {
        authClient.get("/component/" + componentId, (response) => success(response.data.component))
    }

    list(coopId:string, success: (response:Component[]) => void) {
        authClient.get("/component/" + coopId + "/list", (response) => success(response.data.components))
    }

    post(componentId:string, config:ComponentConfig[], success: (response:Component[]) => void) {
        authClient.post("/component/" + componentId,
        {
            component: {
                id: componentId,
                config:config
            }
        },
        (response) => success(response.data.components))
    }

    manual(componentId: string, actionKey: string, zone: string, success: (response: any) => void) {
        authClient.post("/component/" + componentId + "/manual",
            {
                actionKey: actionKey,
                zone: zone
            },
            (response) => success(response.data))
    }

    savePorts(componentId: string, ports: ComponentPort[], success: (response: any) => void) {
        authClient.post("/component/" + componentId + "/ports",
            {
                ports: ports
            },
            (response) => success(response.data))
    }

    portLog(componentId: string, index: number, success: (entries: PortLogEntry[]) => void) {
        authClient.get("/component/" + componentId + "/ports/" + index + "/log",
            (response) => success(response.data.entries))
    }

}

export interface ComponentConfig {
    key:string;
    value:string;
    name:string;
}

export interface ComponentPort {
    index:number;
    name:string;
    config?:ComponentConfig[];
    state?:"ON" | "OFF" | null;
}

export interface PortLogEntry {
    actionKey:string;
    source:string | null;
    status:string;
    createdAt:number;
}

export interface Component {
    id:string;
    name:string;
    serial:string;
    type:string;
    config:ComponentConfig[];
    ports:ComponentPort[];
}

export default new ComponentClient();