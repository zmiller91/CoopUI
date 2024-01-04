
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

}

export interface ComponentConfig {
    key:string;
    value:string;
    name:string;
}

export interface Component {
    id:string;
    name:string;
    serial:string;
    config:ComponentConfig[];
}

export default new ComponentClient();