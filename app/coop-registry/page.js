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
            <CoopRegistry/>
        </div>
    )

}