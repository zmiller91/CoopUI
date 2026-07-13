import authClient from "./auth";

class AreaClient {
    list(coopId: string, success:(response: ListAreaResponse) => void) {
        authClient.get("/areas/" + coopId + "/list",
            (response) => success(response.data))

    }

    add(coopId: string, request: AddAreaRequest, success:(response: AddAreaResponse) => void) {
        authClient.put("/areas/" + coopId + "/add",
            request,
            (response) => success(response.data))

    }

    update(coopId: string, request: UpdateAreaRequest, success:(response: UpdateAreaResponse) => void) {
        authClient.put("/areas/" + coopId + "/update",
            request,
            (response) => success(response.data))

    }

    delete(coopId: string, areaId: string, success:() => void, error?: () => void) {
        authClient.delete("/areas/" + coopId + "/" + areaId, () => success(), error)

    }

    setComponentAreas(coopId: string, componentId: string, request: SetAreasRequest, success:(response: SetAreasResponse) => void) {
        authClient.put("/areas/" + coopId + "/components/" + componentId,
            request,
            (response) => success(response.data))

    }

    setPortAreas(coopId: string, componentId: string, portIndex: number, request: SetAreasRequest, success:(response: SetAreasResponse) => void) {
        authClient.put("/areas/" + coopId + "/components/" + componentId + "/ports/" + portIndex,
            request,
            (response) => success(response.data))

    }
}

export interface ListAreaResponse {
    areas: Area[]
}

export interface AddAreaResponse {
    area: Area
}
export interface AddAreaRequest {
    area: Area
}

export interface UpdateAreaResponse {
    area: Area
}
export interface UpdateAreaRequest {
    area: Area
}

export interface SetAreasRequest {
    areaIds: string[]
}
export interface SetAreasResponse {
    areas: Area[]
}

export interface Area {
    id?: string;
    name: string;
    type: string;
    parentId?: string | null;
}

export default new AreaClient();
