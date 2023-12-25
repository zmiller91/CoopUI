'use client'

import React, {useState, useEffect} from "react";
import coopClient from "../../client/coops"
import CoopRegistry from "./register-coop"
import CoopList from "./list-coops"

export default function Coops() {

    const[registerdCoops, setRegisteredCoops] = useState([])

    useEffect(() => {
        coopClient.list((response) => {
            setRegisteredCoops(response);
        })
    }, [])


    return (

<div className="w-full h-full">

    <div className="pl-4 pt-8 pb-8">
        <span className="text-4xl font-bold neutral-text-700">Coop Registry</span>
    </div>

    {registerdCoops.length === 0 && 
    <div>
        <CoopRegistry/>
    </div>
    }

    {registerdCoops.length > 0 && 
    <div>
        <CoopList coops={registerdCoops}/>
    </div>
    }



</div>




    )

}