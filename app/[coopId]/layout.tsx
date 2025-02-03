'use client'

import { AppBar } from "../../components/app-bar"
import "../../globals.css"
import { MobileBottomNav, MobileNav } from "./navigation"
import React, {useState, useEffect} from 'react'
import {currentCoop} from "./coop-context"
import coops, {CoopDAO} from "../../client/coops"

export default function RootLayout({ children }) {

  const [navVisible, setNavVisible] = useState(false);
  const [coop, setCoop] = useState({} as CoopDAO);

  function toggleNavBar() {
      console.log("click")
      setNavVisible(!navVisible)
  }

  const coopId = currentCoop();

  useEffect(() => {
    coops.getInfo(coopId, (data) => {
      console.log(data);
      setCoop(data);
    });

}, []);

  return (
    <html lang="en">
      <body className="h-screen">

        <AppBar title={coop.name} onNavToggle={toggleNavBar}/>
        <MobileNav onDismiss={toggleNavBar} visible={navVisible}/>

        {children}

        <MobileBottomNav/>

      </body>
    </html>
  )
}