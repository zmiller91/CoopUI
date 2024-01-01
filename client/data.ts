import authClient from "./auth"

class Data {

    private cache: {[key:string]:Datapoint[]} = {};

    getData(coopId: string, metric:string, success: (response:Datapoint[]) => void) {

        const metricPath = coopId + "/" + metric;
        if (this.cache[metricPath]) {
            success(this.cache[metricPath]);
        } else {
            authClient.get("/coops/data/" + metricPath, (response) => {
                this.cache[metricPath] = response.data.data;
                success(this.cache[metricPath])
            })
        }
    }
}

export interface Datapoint {
    value:number;
    date:string;
}

export default new Data();
