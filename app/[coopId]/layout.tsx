'use client'

import { AppBar } from "../../components/app-bar"
import { BottomNav } from "../../components/bottom-nav"
import "../../globals.css"
import { MobileBottomNav, MobileNav } from "./navigation"
import React, {useState} from 'react'

export default function RootLayout({ children }) {

  const [navVisible, setNavVisible] = useState(false);

  function toggleNavBar() {
      console.log("click")
      setNavVisible(!navVisible)
  }

  return (
    <html lang="en">
      <body className="h-screen">
        {navVisible && <MobileNav onDismiss={toggleNavBar}/>}
        <AppBar title="Page Title" onNavToggle={toggleNavBar}/>
        <div className="h-[calc(100vh-112px)] w-screen overflow-auto">
          {children}
        </div>
        <MobileBottomNav/>
      </body>
    </html>
  )
}