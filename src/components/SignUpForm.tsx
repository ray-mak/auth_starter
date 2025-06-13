"use client"

import { oAuthSignIn, signUp } from "@/auth/nextjs/actions"
import { signUpSchema } from "@/auth/nextjs/schemas"
import { redirect } from "next/navigation"
import React, { useState } from "react"
import { z } from "zod"

const SignUpForm = () => {
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
  })

  function handleForm(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    // console.log("Submitting form", data)
    const result = await signUp(data)

    if (result?.error) {
      console.log("error")
      setError(result.error)
    } else {
      console.log("success")
      redirect("/")
    }
  }

  console.log(error)
  return (
    <form
      className="flex flex-col sm:w-[420px] w-[320px] gap-4 mt-16 p-8 rounded bg-white dark:bg-slate-800 shadow-xl"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(form)
      }}
    >
      <p>SignUp</p>
      <label htmlFor="username" className="flex flex-col gap-1">
        <p className="text-sm">Username</p>
        <input
          type="text"
          name="username"
          id="username"
          className="px-2 py-1 border rounded"
          placeholder="Username"
          value={form.username}
          onChange={handleForm}
          autoComplete="new-username"
        />
      </label>
      <label htmlFor="password" className="flex flex-col gap-1">
        <p className="text-sm">Password</p>
        <input
          type="password"
          name="password"
          id="password"
          className="px-2 py-1 border rounded"
          placeholder="Password"
          value={form.password}
          onChange={handleForm}
          autoComplete="new-password"
        />
      </label>
      {/* <label htmlFor="confirmPassword" className="flex flex-col gap-1">
            <p className="text-sm">Confirm Password</p>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="px-2 py-1 border rounded"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleForm}
            />
          </label> */}
      <label htmlFor="email" className="flex flex-col gap-1">
        <p className="text-sm">Email</p>
        <input
          type="email"
          name="email"
          id="email"
          className="px-2 py-1 border rounded"
          placeholder="Email"
          value={form.email}
          onChange={handleForm}
          autoComplete="new-email"
        />
      </label>
      <button
        type="submit"
        className="px-2 py-1 border rounded bg-slate-900 text-white hover:bg-slate-700"
      >
        Sign Up
      </button>
      <button type="button" onClick={async () => await oAuthSignIn("discord")}>
        Discord
      </button>
      <button type="button" onClick={async () => await oAuthSignIn("google")}>
        Google
      </button>
      <button type="button" onClick={async () => await oAuthSignIn("github")}>
        Github
      </button>
    </form>
  )
}

export default SignUpForm
