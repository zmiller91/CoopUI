'use client'

import { useRouter, usePathname } from 'next/navigation'

export function Navigate(props:NavigationProps) {

    const router = useRouter();

    function goTo() {
        router.push(props.path)
    }

    return (

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
            type="button" onClick={goTo} >
                {props.text}
        </button>
    )
}

export interface NavigationProps {
    text:string;
    path:string;
}