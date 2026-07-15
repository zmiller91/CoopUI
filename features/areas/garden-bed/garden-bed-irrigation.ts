import { Area } from "../../../client/area"
import { Component } from "../../../client/component"

export function portKey(componentId: string, portIndex: number): string {
    return `${componentId}:${portIndex}`
}

export function parsePortKey(key: string): { componentId: string; portIndex: number } {
    const [componentId, indexStr] = key.split(":")
    return { componentId, portIndex: Number(indexStr) }
}

// This area plus every ancestor up the parent chain - a valve counts as "available" for port
// association if it's assigned (as a whole device) to any area in this chain, not just this one.
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

export function availableValves(components: Component[], ancestorAreaIds: string[]): Component[] {
    return components.filter(
        (c) => c.type === "VALVE" && (c.areas ?? []).some((a) => ancestorAreaIds.includes(a.id as string))
    )
}

// The ports (across the given valves) already associated with this specific area - not any ancestor,
// since the association itself always targets the exact area it was made from.
export function associatedPortKeys(areaId: string, valves: Component[]): string[] {
    return valves.flatMap((v) =>
        (v.ports ?? [])
            .filter((p) => (p.areas ?? []).some((a) => a.id === areaId))
            .map((p) => portKey(v.id, p.index))
    )
}
