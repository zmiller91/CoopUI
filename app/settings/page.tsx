'use client'

import React, {useState, useEffect} from "react";
import { useSearchParams  } from 'next/navigation';
import coopClient from "../../client/coops"

export default function Settings() {

    const query = useSearchParams();
    const [coopId, setCoopId] = useState(query.get("id"))
    const [message, setMessage] = useState('')

    useEffect(() => {
        coopClient.getSettings(coopId, (settings) => {
            console.log(settings);
            setMessage(settings.message)
        })
    }, [])

    function handleMessageChange(event) {
        setMessage(event.target.value)
    }

    function update() {
        coopClient.updateSettings(coopId, message, (response) => {
            console.log(response);
        })
    }

    return (
        <div>

            <form>

                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                    Message
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="message" 
                    type="text" 
                    name="message" 
                    value={message} 
                    onChange={handleMessageChange}/>

                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="button" 
                    onClick={update}>
                    Update
                </button>

            </form>
        
        </div>
    )
}