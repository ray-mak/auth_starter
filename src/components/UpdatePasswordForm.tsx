"use client"

import { updatePassword } from "@/auth/nextjs/actions"
import { useRouter } from "next/navigation"

import { useState } from "react"

const UpdatePasswordForm = ({ userId }: { userId: string }) => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [passwordError, setPasswordError] = useState<string | null>(null)

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    } else {
      setPasswordError(null)
    }

    const result = await updatePassword({
      userId: userId,
      password: formData.currentPassword,
      newPassword: formData.newPassword,
    })

    if (result?.error) {
      setPasswordError(result.error)
    }

    router.push("/login")
  }

  return (
    <form
      className="flex flex-col p-8 border rounded-sm bg-white sm:w-[420px] w-[320px]"
      onSubmit={handleSubmit}
    >
      <p className="text-2xl font-bold">Change Password</p>
      <label htmlFor="currentPassword" className="flex flex-col gap-1">
        Current Password
        <input
          type="password"
          name="currentPassword"
          id="currentPassword"
          className="p-2 border rounded-sm"
          autoComplete="off"
          value={formData.currentPassword}
          onChange={handleForm}
        />
      </label>
      <label htmlFor="newPassword" className="flex flex-col gap-1">
        New Password
        <input
          type="password"
          name="newPassword"
          id="newPassword"
          className="p-2 border rounded-sm"
          autoComplete="off"
          value={formData.newPassword}
          onChange={handleForm}
        />
      </label>
      <label htmlFor="confirmPassword" className="flex flex-col gap-1">
        Confirm Password
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          className="p-2 border rounded-sm"
          autoComplete="off"
          value={formData.confirmPassword}
          onChange={handleForm}
        />
      </label>
      {passwordError && <p className="text-red-500">{passwordError}</p>}
      <button
        type="submit"
        className="p-2 mt-4 rounded-sm bg-slate-600 text-white hover:bg-slate-700"
      >
        Update Password
      </button>
    </form>
  )
}

export default UpdatePasswordForm
