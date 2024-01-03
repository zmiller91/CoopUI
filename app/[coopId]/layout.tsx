'use client'

import { AppBar } from "../../components/app-bar"
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

        <AppBar title="Page Title" onNavToggle={toggleNavBar}/>
        <MobileNav onDismiss={toggleNavBar} visible={navVisible}/>

        <div className="h-[calc(100vh-112px)] w-screen overflow-auto pr-2 pl-2 pt-4 pb-4">
          {children}
        </div>

        <MobileBottomNav/>

      </body>
    </html>
  )
}