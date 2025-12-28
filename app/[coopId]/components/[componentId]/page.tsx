'use client'

import componentClient, { Component, ComponentConfig } from "../../../../client/component";
import React, {useState, useEffect} from "react";
import { useParams } from "next/navigation";
import Form from "../../../../components/form/form";
import TextInput from "../../../../components/form/text-input";
import LoadingIndicator from "../../../../components/loading-indicator";
import { AppContent } from "../../../../components/app-content";
import SnackBar from "../../../../components/snack-bar";
import {usePageTitle} from "../../../../components/app-bar";

function currentComponent():string {
    return useParams()["componentId"] as string;
}

export default function ComponentRegistry() {

    const componentId = currentComponent();
    const [component, setComponent] = useState({} as Component);
    const [config, setConfig] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [snackBarShowing, setSnackBarShowing] = useState(false);

    usePageTitle(component ? component.name : "Component");
    useEffect(() => {
        componentClient.get(componentId, (c) => {
            setComponent(c);
            setConfig(c.config)
            setHasLoaded(true);
        })
    }, [])

    function update() {
        setIsSaving(true);
        componentClient.post(componentId, config, () => {
            setIsSaving(false);
            setSnackBarShowing(true);
        });
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
        <div>
            <LoadingIndicator isLoading={isSaving}/>
            <AppContent hasLoaded={hasLoaded}>
                <Form submitText="Save" onSubmit={update}>
                    {config?.map((c, idx) => {
                        return <TextInput key={idx} id={c.key} title={c.name} value={config[idx].value} onChange={onChange} required={true}/>
                    })}
                </Form>
            </AppContent>
            <SnackBar message="Component updated." display={snackBarShowing} callback={setSnackBarShowing}/>
        </div>
    )
}