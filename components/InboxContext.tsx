'use client'

import React from 'react'
import {currentCoop} from "../app/[coopId]/coop-context";
import inboxClient from "../client/inbox"

type InboxContextValue = {
    inboxNewCount: number
    setInboxNewCount: React.Dispatch<React.SetStateAction<number>>
    decrementInboxNewCount: () => void
}

const InboxContext = React.createContext<InboxContextValue | null>(null)

export function InboxProvider({ children }: { children: React.ReactNode }) {
    const coopId = currentCoop()
    const [inboxNewCount, setInboxNewCount] = React.useState(0)

    const decrementInboxNewCount = React.useCallback(() => {
        setInboxNewCount((c) => Math.max(0, c - 1))
    }, [])

    const refreshInboxNewCount = React.useCallback(() => {
        if (!coopId) return
        inboxClient.countNew(coopId, (count: number) => {
            setInboxNewCount(count)
        })
    }, [coopId])

    React.useEffect(() => {
        refreshInboxNewCount()
        const id = window.setInterval(refreshInboxNewCount, 300_000)
        return () => window.clearInterval(id)
    }, [refreshInboxNewCount])


    const value = React.useMemo(
        () => ({ inboxNewCount, setInboxNewCount, decrementInboxNewCount }),
        [inboxNewCount, decrementInboxNewCount]
    )

    return <InboxContext.Provider value={value}>{children}</InboxContext.Provider>
}

export function useInbox() {
    const ctx = React.useContext(InboxContext)
    if (!ctx) throw new Error('useInbox must be used within InboxProvider')
    return ctx
}
