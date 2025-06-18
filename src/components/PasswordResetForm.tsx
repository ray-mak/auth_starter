"use client"

import React from "react"
import { useRouter } from "next/navigation"

const PasswordResetForm = () => {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [error, setError] = React.useState("")

  function handleForm(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      const res = await fetch("/api/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        router.push("/reset-password/sent")
      }

      if (!res.ok) {
        const data = await res.json()
        setError(data.error)
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <form
      className="flex flex-col p-8 border rounded-sm bg-white sm:w-[420px] w-[320px]"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold mb-4">Password Reset</h1>
      <p className="mb-4">
        Enter your email address and we will send you a link to reset your
        password.
      </p>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={email}
        onChange={handleForm}
        className="mb-4 p-2 border rounded-sm"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        type="submit"
        className="py-2 px-4 rounded border bg-blue-500 text-white hover:bg-blue-600"
      >
        Reset Password
      </button>
    </form>
  )
}

export default PasswordResetForm
