import axios from 'axios';


class AuthClient {

//     private readonly domain:string = "http://192.168.50.45:8042"
    private readonly domain:string = "https://api.pisprout.com"
//     private readonly domain:string = "http://localhost:8042"
    private readonly tokenKey:string = "token";

    private config() {
        return {
            headers: {
                Authorization: "Bearer " + localStorage.getItem(this.tokenKey),
                "Access-Control-Allow-Origin": "*"
            }
        }
    }

    get(path:string, success: (response:any) => void) {
        axios.get(this.domain + path, this.config()).then(success).catch()
    }

    post(path:string, data: any, success: (response:any) => void) {
        axios.post(this.domain + path, data, this.config()).then(success)
    }

    login(username: string, password: string, success: () => void) {
        axios.post(this.domain + "/login", {username, password}).then(response => {
            localStorage.setItem(this.tokenKey, response.data["token"])
            success()
        })
    }

}

export default new AuthClient();