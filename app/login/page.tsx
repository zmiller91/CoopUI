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
import Image from "next/image";
import {Card} from "../../components/card";



export default function Login() {

  const router = useRouter();
  const [username, setUserName] = useState("")
  const [password, setPassowrd] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  function loginSuccess() {
    coopClient.list((coops) => {
      if (coops.length > 0) {
        router.push("/" + coops[0].id + "/dashboard")
      } else {
        router.push(href("/coop-registry"))
      }
    })
  }

  function loginError(error: any) {
    setLoading(false);
    setError(true);
  }

  function login() {
    setLoading(true);
    setError(false);
    authClient.login(username, password, loginSuccess, loginError)
  }

  function register() {
    router.push(href("/register"))
  }

  return (
    <div>
      <LoadingIndicator isLoading={loading}/>
      <AppContent adjustForBottomNav={false} adjustForTopNav={false}>
        <div className="min-h-full flex flex-col py-4 px-4">
          <div className="flex items-center justify-center">
            <Image src="/brand/logo.png" alt="logo" width={400} height={400} priority />
          </div>

          <div className="mt-4 flex flex-row items-center">
            <Form submitText="Log in" onSubmit={login}>
              <TextInput id="username" title="Username" value={username} onChange={setUserName} required={true}/>
              <TextInput id="password" title="Password" type="password" value={password} onChange={setPassowrd} required={true} />
            </Form>
          </div>

          <div className="w-full">
            <div className="mt-4 text-center text-error-500">
              {error && <div>Invalid username or password.</div>}
            </div>
          </div>

          <div className="mt-auto ">
            <div className="text-neutral-600 flex items-center justify-center">
              Don't have an account?
            </div>
            <div className="font-semibold text-primary-600 flex items-center justify-center">
              <a className="tracking-wide" href="/register">Sign up</a>
            </div>
          </div>
        </div>
      </AppContent>
    </div>
    );
  
}
