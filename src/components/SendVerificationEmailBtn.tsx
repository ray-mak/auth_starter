"use client"

import React from "react"

const SendVerificationEmailBtn = ({ email }: { email: string }) => {
  async function handleClick() {
    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <button
      type="button"
      className="underline text-sm text-blue-600 hover:text-blue-800"
      onClick={handleClick}
    >
      Send Verification Email
    </button>
  )
}

export default SendVerificationEmailBtn
