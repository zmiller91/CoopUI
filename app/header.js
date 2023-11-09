'use client'

import React from "react";
import Link from 'next/link'

export default class Header extends React.Component {

  render() {
    return (
        <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-4">


            <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div class=" lg:flex-grow">
                    <Link href="/login" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">Login</Link>
                    <Link href="/info" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">Information</Link>
                </div>
            </div>


        </nav>

    );
  }
}
