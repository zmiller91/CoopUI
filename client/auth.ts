import axios from 'axios';

class AuthClient {

    // This process.env has to be formatted exactly this way so that nodejs will perform a replacement when it goes to
    // compile this file: https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
    private readonly domain:string = process.env['NEXT_PUBLIC_API_URL'];
    private readonly tokenKey:string = "token";

    private config() {
        return {
            headers: {
                Authorization: "Bearer " + localStorage.getItem(this.tokenKey),
                "Access-Control-Allow-Origin": "*"
            }
        }
    }

    get(path:string, success: (response:any) => void, error?: () => void) {
        axios.get(this.domain + path, this.config()).then(success).catch(() => error && error())
    }

    delete(path:string, success: (response:any) => void, error?: () => void) {
        axios.delete(this.domain + path, this.config()).then(success).catch(() => error && error())
    }

    post(path:string, data: any, success: (response:any) => void) {
        axios.post(this.domain + path, data, this.config()).then(success)
    }

    put(path: string, data: any, success: (response:any) => void ){
        axios.put(this.domain + path, data, this.config()).then(success)
    }

    login(username: string, password: string, success: () => void, error?: (reason:any) => void) {
        axios.post(this.domain + "/login", {username, password})
            .then(response => {
                localStorage.setItem(this.tokenKey, response.data["token"])
                success()
            })
            .catch((reason) => error && error(reason))
    }

    register(username: string, password: string, success: () => void) {
        axios.post(this.domain + "/register", {username, password}).then(response => {
            localStorage.setItem(this.tokenKey, response.data)
            success()
        })
    }

}

export default new AuthClient();