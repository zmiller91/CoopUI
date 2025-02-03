'use client'

import React, {useEffect, useState} from "react";
import authClient from "../client/auth"
import coopClient from "../client/coops"
import { useRouter } from 'next/navigation'
import data from "../client/data";
import { href } from "../utils/path";


export default function Login() {

    const router = useRouter();



    useEffect(() => {
        coopClient.list(
            (coops) => {
                if (coops.length > 0) {
                    router.push("/" + coops[0].id + "/dashboard")
                } else {
                    router.push(href("/coop-registry"))
                }
            },
            () => {
                router.push(href("/login"));
            })

    }, []);

    return (
        <div>



        </div>
    );

}
