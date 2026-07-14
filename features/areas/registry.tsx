import { ComponentType } from "react"
import { Area } from "../../client/area"
import { ComponentData } from "../../client/data"
import { Component } from "../../client/component"
import GroupCard from "../../components/dashboard/group-card"
import GardenGroupCard from "./garden/garden-group-card"
import ChickenCoopGroupCard from "./chicken-coop/chicken-coop-group-card"
import GardenDetailContent from "./garden/garden-detail-content"
import GenericAreaDetailContent from "./generic-area-detail-content"
import GenericAreaPreviewLine from "./generic-area-preview-line"
import GardenBedPreviewLine from "./garden-bed/garden-bed-preview-line"

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
    memberComponents: Component[];         // every Component directly in this area (ports, config, etc.)
    childAreas: Area[];                    // this area's direct children
    allComponents: Component[];            // every Component in the coop, for looking up child areas' members
    allData: ComponentData[];              // every ComponentData in the coop, for looking up child areas' members
}

export interface AreaPreviewLineProps {
    area: Area;
    coopId: string;
    allComponents: Component[];            // every Component in the coop, for looking up this area's members
    allData: ComponentData[];              // every ComponentData in the coop, for looking up this area's members
    onClick: () => void;
}

// GARDEN_BED and OTHER have no custom card yet - they fall back to the generic GroupCard.
class AreaCardRegistry {
    private readonly components: Record<string, ComponentType<AreaCardProps>> = {
        GARDEN: GardenGroupCard,
        CHICKEN_COOP: ChickenCoopGroupCard,
    }

    get(type: string): ComponentType<AreaCardProps> {
        return this.components[type] ?? GroupCard
    }
}
export const AREA_CARD_REGISTRY = new AreaCardRegistry()

class AreaDetailContentRegistry {
    private readonly components: Record<string, ComponentType<AreaDetailContentProps>> = {
        GARDEN: GardenDetailContent,
    }

    get(type: string): ComponentType<AreaDetailContentProps> {
        return this.components[type] ?? GenericAreaDetailContent
    }
}
export const AREA_DETAIL_CONTENT_REGISTRY = new AreaDetailContentRegistry()

class AreaPreviewLineRegistry {
    private readonly components: Record<string, ComponentType<AreaPreviewLineProps>> = {
        GARDEN_BED: GardenBedPreviewLine,
    }

    get(type: string): ComponentType<AreaPreviewLineProps> {
        return this.components[type] ?? GenericAreaPreviewLine
    }
}
export const AREA_PREVIEW_LINE_REGISTRY = new AreaPreviewLineRegistry()
