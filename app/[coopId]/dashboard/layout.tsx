'use client'


import React, {useState} from 'react'

export default function RootLayout({ children }) {


  return (
    <div className="background-neutral-200 h-full">
        {children}
    </div>
  )
}