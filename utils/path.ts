

export function href(path: string, query?: {[key: string]: string}) {
    const queries: string[] = []
    if (query) {
        for(var q in query) {
            queries.push(q + "=" + query[q])
        }
    }

    return path + (queries.length > 0 ? "?" + queries.join("&") : "")
}