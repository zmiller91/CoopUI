'use client'

import React, {useState, useEffect} from "react";
import coopClient from "../../../client/coops"
import Form from "../../../components/form/form";
import TextInput from "../../../components/form/text-input";
import {currentCoop} from "../coop-context"
import { AppContent } from "../../../components/app-content";

export default function Settings() {

    const coopId = currentCoop()
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
        <AppContent>
            <Form submitText="Update" onSubmit={update}>
                <TextInput id="message" title="Message" value={message} onChange={setMessage}/>
            </Form>
        </AppContent>
    )
}