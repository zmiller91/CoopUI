import axios from 'axios';

class AuthClient {

    private readonly domain:string = "http://localhost:8080"

    private authToken:string;

    
    get(path:string, success: (response:any) => void) {

        const config = {
            headers: {
                Authorization: "Bearer " + this.authToken,
                "Access-Control-Allow-Origin": "*"
            }
        }

        axios.get(this.domain + path, config).then(success)


    }



    login(username: string, password: string, success: () => void) {
        axios.post(this.domain + "/login", {username, password}).then(response => {
            this.authToken = response.data["token"]
            success()
        })
    }

}

export default new AuthClient();