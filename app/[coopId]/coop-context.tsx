import { useParams } from "next/navigation";

export function currentCoop():string {
    return useParams()["coopId"] as string;
}