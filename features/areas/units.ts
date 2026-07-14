export function celsiusToFahrenheit(celsius: number): number {
    return Math.round((celsius * 9) / 5 + 32)
}

export function mmToInches(mm: number): number {
    return Math.round((mm / 25.4) * 100) / 100
}

export function gramsToLbs(grams: number): number {
    return Math.round((grams * 10) / 453.592) / 10
}
