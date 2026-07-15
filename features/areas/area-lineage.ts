import { Area } from "../../client/area"

// Returns this area's id followed by every ancestor's id, walking up the parent chain to the root.
export function ancestorIds(area: Area, areas: Area[]): string[] {
    const areasById = new Map(areas.map((a) => [a.id, a]))
    const ids: string[] = []
    let current: Area | undefined = area
    while (current) {
        if (current.id) ids.push(current.id)
        current = current.parentId ? areasById.get(current.parentId) : undefined
    }
    return ids
}
