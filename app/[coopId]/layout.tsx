'use client'

import { AppBar } from "../../components/app-bar"
import "../../globals.css"
import { MobileNav } from "./navigation"
import React, {useState} from 'react'

export default function RootLayout({ children }) {

  const [navVisible, setNavVisible] = useState(true);

  function toggleNavBar() {
      console.log("click")
      setNavVisible(!navVisible)
  }

  return (
    <html lang="en">
      <body>
        {navVisible && <MobileNav onDismiss={toggleNavBar}/>}
        <AppBar title="Page Title" onNavToggle={toggleNavBar}/>
        <div className="h-full w-screen">
          {children}
        </div>
      </body>
    </html>
  )
}