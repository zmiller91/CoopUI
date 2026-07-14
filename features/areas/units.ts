export function celsiusToFahrenheit(celsius: number): number {
    return Math.round((celsius * 9) / 5 + 32)
}

export function mmToInches(mm: number): number {
    return Math.round((mm / 25.4) * 100) / 100
}

export function gramsToLbs(grams: number): number {
    return Math.round((grams * 10) / 453.592) / 10
}

export function solarRadiationLabel(wattsPerM2: number): string {
    if (wattsPerM2 < 50) return "None"
    if (wattsPerM2 < 250) return "Low"
    if (wattsPerM2 < 500) return "Moderate"
    if (wattsPerM2 < 800) return "High"
    return "Very high"
}

export function cloudCoverLabel(percent: number): string {
    if (percent < 10) return "Clear skies"
    if (percent < 30) return "Mostly clear"
    if (percent < 60) return "Partly cloudy"
    if (percent < 85) return "Mostly cloudy"
    return "Overcast"
}
