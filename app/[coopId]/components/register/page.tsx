'use client'

import React, { useState} from "react";
import componentClient from "../../../../client/component"
import Form from "../../../../components/form/form";
import TextInput from "../../../../components/form/text-input";
import { currentCoop } from "../../coop-context";
import { useRouter } from 'next/navigation'
import { AppContent } from "../../../../components/app-content";
import { usePageTitle} from "../../../../components/app-bar";

export default function ComponentRegistry() {

    usePageTitle("Register Component")

    const coopId = currentCoop();
    const [serialNumber, setSerialNumber] = useState('')
    const [name, setName] = useState('')
    const router = useRouter();

    function register() {
        componentClient.register(coopId, serialNumber, name, (response) => {
            router.back()
        })
    }

    return (
        <div>
            <AppContent>
                <Form submitText="Register" onSubmit={register}>
                    <TextInput id="serial" title="Serial Number" value={serialNumber} onChange={setSerialNumber} required={true}/>
                    <TextInput id="name" title="Name" value={name} onChange={setName} required={true}/>
                </Form>
            </AppContent> 
        </div>
    )
}