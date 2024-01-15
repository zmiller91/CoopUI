'use client'


import React, {useState} from 'react'

export default function RootLayout({ children }) {


  return (
    <div className="bg-white h-full">
        {children}
    </div>
  )
}