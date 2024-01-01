'use client'

import React from "react";
import Link from 'next/link'

export default class Header extends React.Component {

  render() {
    return (
        <nav className="sticky top-[100vh] flex items-center justify-between flex-wrap header-background p-4 h-[56px]">


            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className=" lg:flex-grow">
                    <Link href="/login" className="primary-text-100 block lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4 float-right">Login</Link>
                </div>
            </div>


        </nav>

    );
  }
}
