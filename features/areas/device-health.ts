import { ComponentData } from "../../client/data"
import { Status, computeStatus } from "../../app/[coopId]/dashboard/status-info"

export interface GroupHealth {
    total: number
    online: number
    stale: number
    offline: number
}

export function computeGroupHealth(members: ComponentData[]): GroupHealth {
    const result: GroupHealth = { total: members.length, online: 0, stale: 0, offline: 0 }

    members.forEach((d) => {
        const minutesAgo = Math.round((Date.now() - d.lastUpdate) / 1000 / 60)
        const status = computeStatus(minutesAgo)
        if (status === Status.ONLINE) result.online++
        else if (status === Status.OFFLINE) result.offline++
        else result.stale++
    })

    return result
}
