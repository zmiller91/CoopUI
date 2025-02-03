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
      
      <AppBar title="Sign In"/>
      <LoadingIndicator isLoading={loading}/>
      <AppContent adjustForBottomNav={false} adjustForTopNav={true}>

        <div className="flex flex-row items-center w-full h-full">
          <Form submitText="Sign In" onSubmit={login}>
            <TextInput id="username" title="Username" value={username} onChange={setUserName} required={true}/>
            <TextInput id="password" title="Password" type="password" value={password} onChange={setPassowrd} required={true} />
          </Form>
        </div>

        <div className="w-full lg:w-1/2">
          <button className=" mt-4 h-[36px] w-full background-neutral-200 text-neutral-800 shadow-md rounded-md" type="button" onClick={register}>
              <span className="pr-4 pl-4 flex center-items justify-center">
                  Register
              </span>
          </button>

          <div className="mt-4 text-center text-error-500">
            {error && <div>Invalid username or password.</div>}
          </div>

        </div>

      </AppContent>

    </div>
    );
  
}
