function ordinal(n: number): string {
    if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`

    switch (n % 10) {
        case 1: return `${n}st`
        case 2: return `${n}nd`
        case 3: return `${n}rd`
        default: return `${n}th`
    }
}

export function formatDateToFriendlyString(input: string | number | Date): string {
    const d = new Date(input)

    const month = d.toLocaleString(undefined, { month: 'long' })
    const day = ordinal(d.getDate())
    const year = d.getFullYear()

    return `${month} ${day}, ${year}`
}



export function formatRelativeDate(input: string | number | Date): string {
    const date = new Date(input)
    const now = new Date()

    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)

    if (diffSec < 0) return 'Just now'

    if (diffSec < 60) return 'Just now'

    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin}m`

    const diffHr = Math.floor(diffMin / 60)
    if (diffHr < 24) return `${diffHr}h`

    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)

    const startOfDate = new Date(date)
    startOfDate.setHours(0, 0, 0, 0)

    const diffDays =
        (startOfToday.getTime() - startOfDate.getTime()) / (24 * 60 * 60 * 1000)

    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7)
        return date.toLocaleDateString(undefined, { weekday: 'short' })

    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
    })
}