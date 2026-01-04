import authClient from "./auth"

class Data {

    private cache: {[key:string]:Datapoint[]} = {};
    private coopDataCache: {[key:string]:ComponentData[]} = {};
    private componentDataCache: {[key:string]:ComponentData} = {};

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

    getCoopData(coopId: string, success: (response:ComponentData[]) => void) {

        const metricPath = "/data/" + coopId;
        if (this.coopDataCache[metricPath]) {
            success(this.coopDataCache[metricPath]);
        } else {
            authClient.get(metricPath, (response) => {
                this.coopDataCache[metricPath] = response.data.data;
                success(this.coopDataCache[metricPath])
            })
        }
    }

    getComponentData(coopId: string, componentId:string, interval:MetricInterval, success: (response:ComponentData) =>void ) {

        const metricPath = `/data/${coopId}/${componentId}/${interval}`;
        if (this.componentDataCache[metricPath]) {
            success(this.componentDataCache[metricPath]);
        } else {
            authClient.get(metricPath, (response) => {
                this.componentDataCache[metricPath] = response.data.data;
                success(this.componentDataCache[metricPath])
            })
        }
    }
}

export interface ComponentData {
    componentId:string;
    data:{[key:string]:any}[];
    batteryLevel:number;
    lastUpdate:number;
    componentType: string;
    componentName: string;
    componentTypeDescription: string;
}

export interface Datapoint {
    value:number;
    date:string;
}

export enum MetricInterval {
    DAY="DAY", WEEK="WEEK", MONTH="MONTH", YEAR="YEAR"
}

export default new Data();
