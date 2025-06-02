"use client"

import { logOut } from "@/auth/nextjs/actions"
import { useRouter } from "next/navigation"

export default function LogOutButton() {
  const router = useRouter()

  async function handleLogOut() {
    await logOut()
    router.push("/login")
  }
  return (
    <button
      className="py-2 px-4 rounded border bg-red-500 text-white hover:bg-red-600"
      onClick={handleLogOut}
    >
      Log out
    </button>
  )
}
