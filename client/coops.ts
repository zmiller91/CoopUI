
import authClient from "./auth"


export interface CoopDAO {
    id:string,
    name:string
}

class CoopClient {

    list(success: (response:CoopDAO[]) => void, error?: () => void) {
        authClient.get("/coops/list", (response) => success(response.data.coops), error)
    }

    register(id:string, name:string, success: (response:any) => void) {
        const data = {
            id: id,
            name: name
        }

        authClient.post("/coops/register", data, (response) => success(response.data.coop))
    }

    getSettings(coopId: string, success: (response:any) => void) {
        authClient.get("/coops/settings/" + coopId, (response) => success(response.data.settings))
    }

    updateSettings(coopId: string, message: string, success: (response:any) => void) {
        const data = {
            settings: {
                message: message
            }
        }
        authClient.post("/coops/settings/" + coopId, data, success)
    }

    getData(coopId: string, metric:string, success: (response:any) => void) {
        authClient.get("/coops/data/" + coopId + "/" + metric, (response) => success(response.data))
    }

    getInfo(coopId: string, success: (response:any) => void) {
        authClient.get("/coops/" + coopId, (response) => success(response.data.coop))
    }

}

export default new CoopClient();
