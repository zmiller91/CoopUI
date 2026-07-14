import { ComponentType } from "react"
import { Area } from "../../client/area"
import { ComponentData } from "../../client/data"
import { Component } from "../../client/component"
import GardenGroupCard from "./garden/garden-group-card"
import ChickenCoopGroupCard from "./chicken-coop/chicken-coop-group-card"

export interface AreaCardProps {
    area: Area;
    members: ComponentData[];              // every ComponentData directly in this area - not filtered by
                                            // CHART_CONFIG/chartability, so any metric a component reports
                                            // is available here regardless of whether it's ever rendered as
                                            // a generic ChartCard anywhere else
    memberComponents: Component[];         // every Component directly in this area, incl. non-metric ones (valves)
    onClick: () => void;
}

export interface AreaDetailContentProps {
    coopId: string;
    area: Area;
    members: ComponentData[];              // this area's chartable members' current data, for charts
}

// GARDEN_BED and OTHER have no custom card yet - they fall back to the generic GroupCard.
export const AREA_CARD_REGISTRY: Record<string, ComponentType<AreaCardProps>> = {
    GARDEN: GardenGroupCard,
    CHICKEN_COOP: ChickenCoopGroupCard,
}

export const AREA_DETAIL_CONTENT_REGISTRY: Record<string, ComponentType<AreaDetailContentProps>> = {}
