'use client'

import React, {useState} from "react";
import authClient from "../../client/auth"
import coopClient from "../../client/coops"
import { useRouter } from 'next/navigation'
import { href } from "../../utils/path";
import Form from "../../components/form/form";
import TextInput from "../../components/form/text-input";


export default function Login() {

  const router = useRouter();
  const [username, setUserName] = useState("")
  const [password, setPassowrd] = useState("")

  function handleUsernameChange(event) {
    setUserName(event.target.value)
  }

  function handlePasswordChange(event) {
    setPassowrd(event.target.value)
  }

  function login() {

    console.log("Logging in...");

      authClient.login(username, password, () => {
        coopClient.list((coops) => {
          if (coops.length > 0) {
            router.push(href("/dashboard", {id: coops[0].id}))
          } else {
            router.push(href("/coops"))
          }
        })
      })
  }

  return (

    <div>
      <Form submitText="Sign In" onSubmit={login}>
        <TextInput id="username" title="Username" value={username} onChange={setUserName} required={true}/>
        <TextInput id="password" title="Password" type="password" value={password} onChange={setPassowrd} required={true} />
      </Form>
    </div>

    );
  
}
