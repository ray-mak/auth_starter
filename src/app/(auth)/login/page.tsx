"use client"

import { signIn } from "@/auth/nextjs/actions"
import { signInSchema } from "@/auth/nextjs/schemas"
import { redirect } from "next/navigation"
import { useState } from "react"
import { z } from "zod"

const page = () => {
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  })

  function handleForm(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    const result = await signIn(data)

    if (result?.error) {
      console.log("error")
      setError(result.error)
    } else {
      console.log("success")
      redirect("/")
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <form
          className="flex flex-col sm:w-[420px] w-[320px] gap-4 mt-16 p-8 rounded bg-white dark:bg-slate-800 shadow-xl"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit(formData)
          }}
        >
          <p>Login</p>
          <label htmlFor="identifier" className="flex flex-col gap-1">
            <p className="text-sm">Email or Username</p>
            <input
              type="text"
              name="identifier"
              id="identifier"
              value={formData.identifier}
              onChange={handleForm}
              autoComplete="username"
              className="px-2 py-1 border rounded"
            />
          </label>
          <label htmlFor="password" className="flex flex-col gap-1">
            <p className="text-sm">Password</p>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleForm}
              autoComplete="current-password"
              className="px-2 py-1 border rounded"
            />
          </label>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default page
