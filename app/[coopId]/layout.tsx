'use client'

import {AppBar, AppBarProvider, useAppBar} from "../../components/app-bar";
import "../../globals.css";
import { MobileBottomNav, MobileNav } from "./navigation";
import React, { useState, useEffect } from 'react';
import { currentCoop } from "./coop-context";
import coops, { CoopDAO } from "../../client/coops";
import {InboxProvider} from "../../components/InboxContext";

function LayoutShell({ children }) {
    const [navVisible, setNavVisible] = useState(false);
    const [coop, setCoop] = useState({} as CoopDAO);

    const { title } = useAppBar();
    const coopId = currentCoop();

    function toggleNavBar() {
        setNavVisible(!navVisible);
    }

    useEffect(() => {
        coops.getInfo(coopId, setCoop);
    }, [coopId]);

    return (
        <div>
            <AppBar
                title={title ?? coop.name}
                onNavToggle={toggleNavBar}
            />

            <MobileNav onDismiss={toggleNavBar} visible={navVisible} />

            {children}

            <MobileBottomNav />
        </div>
    );
}

export default function RootLayout({ children }) {
    return (
        <AppBarProvider>
            <InboxProvider>
                <LayoutShell>{children}</LayoutShell>
            </InboxProvider>
        </AppBarProvider>
    );
}
