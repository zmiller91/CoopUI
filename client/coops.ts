
import authClient from "./auth"

class CoopClient {

    list(success: (response:any) => void) {
        authClient.get("/coops/list", (response) => success(response.data.coops))
    }

    register(id:string, name:string, success: (response:any) => void) {
        const data = {
            id: id,
            name: name
        }

        authClient.post("/coops/register", data, success)
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

}

export default new CoopClient();