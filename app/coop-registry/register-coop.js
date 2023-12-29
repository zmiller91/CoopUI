import React, {useState, useEffect} from "react";
import coopClient from "../../client/coops"
import { href } from "../../utils/path";
import { useRouter } from 'next/navigation'

export default function CoopRegistry() {

    const [coopId, setCoopId] = useState('') 
    const [name, setName] = useState('') 
    const router = useRouter();

    function handleCoopIdChange(event) {
        setCoopId(event.target.value)
    }

    function handleNameChange(event) {
        setName(event.target.value)
    }

    
    function register() {
        coopClient.register(coopId, name, (coop) => {
            router.push(href("/dashboard", {id: coop.id}))
        });
    }
    
    return (
        <div>

            <form>

                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="name" 
                    type="text" 
                    name="name" 
                    value={name} 
                    onChange={handleNameChange}/>

                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="coopId">
                    Serial Number
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="coopId" 
                    type="text" 
                    name="coopId" 
                    value={coopId} 
                    onChange={handleCoopIdChange}/>

                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="button" 
                    onClick={register}>
                    Register
                </button>

            </form>

        </div>
    )
}