'use client'

import { AppBar } from "../../components/app-bar"
import "../../globals.css"
import { MobileBottomNav, MobileNav } from "./navigation"
import React, {useState} from 'react'
import { AppContent } from "../../components/app-content"

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

        {children}

        <MobileBottomNav/>

      </body>
    </html>
  )
}