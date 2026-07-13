import { ComponentType } from "react"
import { Area } from "../../client/area"
import { ComponentData } from "../../client/data"

export interface AreaCardProps {
    area: Area;
    members: ComponentData[];
    onClick: () => void;
}

export interface AreaDetailContentProps {
    coopId: string;
    area: Area;
    members: ComponentData[];              // this area's chartable members' current data, for charts
}

// Empty for v1 - every type falls back to the generic GroupCard / generic detail content.
// Adding a Garden-specific card later is: build features/areas/garden/garden-group-card.tsx,
// add `GARDEN: GardenGroupCard` here - no changes needed to the Dashboard or detail page.
export const AREA_CARD_REGISTRY: Record<string, ComponentType<AreaCardProps>> = {}

export const AREA_DETAIL_CONTENT_REGISTRY: Record<string, ComponentType<AreaDetailContentProps>> = {}
