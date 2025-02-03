'use client'

import React, {useState} from "react";
import authClient from "../../client/auth"
import coopClient from "../../client/coops"
import { useRouter } from 'next/navigation'
import { href } from "../../utils/path";
import Form from "../../components/form/form";
import TextInput from "../../components/form/text-input";
import { AppBar } from "../../components/app-bar";
import { AppContent } from "../../components/app-content";
import LoadingIndicator from "../../components/loading-indicator";


export default function Register() {

    const router = useRouter();
    const [username, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [verifyPassword, setVerifyPassword] = useState("")
    const [loading, setLoading] = useState(false)

    function register() {

        setLoading(true);
        authClient.register(username, password, () => {
            coopClient.list((coops) => {
                router.push(href("/coop-registry"))
            })
        })
    }

    return (
        <div>

            <AppBar title="Register"/>
            <LoadingIndicator isLoading={loading}/>
            <AppContent adjustForBottomNav={false} adjustForTopNav={true}>

                <div className="flex flex-row items-center w-full h-full">
                    <Form submitText="Register" onSubmit={register} disabled={loading || password !== verifyPassword}>
                        <TextInput id="username" title="Username" value={username} onChange={setUserName} required={true}/>
                        <TextInput id="password" title="Password" type="password" value={password} onChange={setPassword} required={true} />
                        <TextInput id="verify-password" title="Verify Password" type="password" value={verifyPassword} onChange={setVerifyPassword} required={true} />
                    </Form>

                </div>
                <div className="mt-4 text-center text-error-500">
                    {password !== verifyPassword && <div>Passwords don't match.</div>}
                </div>
            </AppContent>

        </div>
    );

}
