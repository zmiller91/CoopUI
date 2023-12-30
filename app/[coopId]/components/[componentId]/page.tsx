'use client'

import { Navigate } from "../../../../components/navigation"
import componentClient, { Component, ComponentConfig } from "../../../../client/component";
import React, {useState, useEffect} from "react";
import { useParams } from "next/navigation";
import Form from "../../../../components/form/form";
import TextInput from "../../../../components/form/text-input";
import { setConfig } from "next/config";

function currentComponent():string {
    return useParams()["componentId"] as string;
}

export default function ComponentRegistry() {

    const componentId = currentComponent();
    const [component, setComponent] = useState({});
    const [config, setConfig] = useState([])

    useEffect(() => {
        componentClient.get(componentId, (c) => {
            setComponent(c);
            setConfig(c.config)
        })
    }, [])

    function update() {
        console.log(config);
    }

    function onChange(value, event) {

        setConfig((previousConfig) => {
            const newConfig = ([...previousConfig] as ComponentConfig[])
            for(var idx in newConfig) {
                const cfg = newConfig[idx]
                if(cfg.key === event.target.id) {
                    cfg.value = value
                }
            }

            return newConfig
        })
    }

    return (
        <Form submitText="Save" onSubmit={update}>
            {config?.map((c, idx) => {
                return <TextInput key={idx} id={c.key} title={c.name} value={config[idx].value} onChange={onChange} required={true}/>
            })}
        </Form>
    )
}