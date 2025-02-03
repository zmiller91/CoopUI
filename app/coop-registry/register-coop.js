import React, {useState, useEffect} from "react";
import coopClient from "../../client/coops"
import { href } from "../../utils/path";
import { useRouter } from 'next/navigation'
import {AppBar} from "../../components/app-bar";
import LoadingIndicator from "../../components/loading-indicator";
import {AppContent} from "../../components/app-content";
import Form from "../../components/form/form";
import TextInput from "../../components/form/text-input";

export default function CoopRegistry() {

    const router = useRouter();
    const [coopId, setCoopId] = useState('') 
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    function register() {
        setLoading(true);
        coopClient.register(coopId, name, (coop) => {
            router.push("/" + coop.id + "/dashboard")
        });
    }
    
    return (
        <div>

            <AppBar title="Coop Registry"/>
            <LoadingIndicator isLoading={loading}/>
            <AppContent adjustForBottomNav={false} adjustForTopNav={true}>

                <div className="flex flex-row items-center w-full h-full">
                    <Form submitText="Register" onSubmit={register}>
                        <TextInput id="name" title="Name" value={name} onChange={setName} required={true}/>
                        <TextInput id="coopId" title="Serial Number" value={coopId} onChange={setCoopId} required={true} />
                    </Form>

                </div>
            </AppContent>

        </div>
    )
}