import { Component } from "../../../client/component"

export function portKey(componentId: string, portIndex: number): string {
    return `${componentId}:${portIndex}`
}

export function parsePortKey(key: string): { componentId: string; portIndex: number } {
    const [componentId, indexStr] = key.split(":")
    return { componentId, portIndex: Number(indexStr) }
}

// A valve counts as "available" for a garden bed's irrigation-zone association if it's assigned (as a
// whole device) to any area in the given ancestor chain, not just the bed itself - build that chain with
// features/areas/area-lineage.ts's ancestorIds.
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
