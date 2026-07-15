'use client'

// Fallback for any area type without a registered edit section - the edit page always renders
// AREA_EDIT_SECTION_REGISTRY.get(area.type), so this is what makes that a no-op for everything else.
export default function NoAreaEditSection() {
    return null
}
