import { AREA_TYPE_META } from "../../components/dashboard/group-card"
import { SelectOption } from "../../components/form/select"

// UI-only opinion about what's sensible to nest under a given parent type - not enforced by
// the backend (AreaService accepts any type/parentId combination). A type absent from this map
// falls back to the full default list (same as calling with no parentType at all). An explicit
// empty array means "nothing makes sense here," which hides the Add Child Group affordance for
// that parent type entirely.
const CHILD_TYPES: Record<string, string[]> = {
    GARDEN: ["GARDEN_BED", "OTHER"],
    GARDEN_BED: [], // terminal - a bed doesn't contain further groups
    CHICKEN_COOP: ["OTHER"],
}

export function getChildAreaTypeOptions(parentType?: string): SelectOption[] {
    const keys = parentType && parentType in CHILD_TYPES
        ? CHILD_TYPES[parentType]
        : Object.keys(AREA_TYPE_META)

    return keys.map((key) => ({ label: AREA_TYPE_META[key]?.label ?? key, value: key }))
}
