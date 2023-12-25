'use client'

import React, {useState} from "react";
import authClient from "../../client/auth"
import coopClient from "../../client/coops"
import { useRouter } from 'next/navigation'
import { href } from "../../utils/path";


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

<div className="w-full max-w-xs">
  <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div className="mb-4">

      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
        Username
      </label>
      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
        id="username" 
        type="text" 
        name="username" 
        value={username} 
        onChange={handleUsernameChange}/>

    </div>
    <div className="mb-6">

      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
        Password
      </label>
      <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
        id="password" 
        type="password" 
        name="password" 
        value={password} 
        onChange={handlePasswordChange}/>

      <p className="text-red-500 text-xs italic">Please choose a password.</p>
    </div>
    <div className="flex items-center justify-between">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
        type="button" 
        onClick={login}>
        Sign In
      </button>
      <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
        Forgot Password?
      </a>
    </div>
  </form>

</div>
    );
  
}
