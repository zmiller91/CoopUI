'use client'

import "../globals.css"
import React, {useState} from 'react'

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className="font-sans h-screen">

        {children}

      </body>
    </html>
  )
}