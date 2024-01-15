import { useParams } from "next/navigation";

export function currentComponent():string {
    return useParams()["componentId"] as string;
}