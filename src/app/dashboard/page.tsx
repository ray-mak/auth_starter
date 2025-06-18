import { getCurrentUser } from "@/auth/nextjs/currentUser"
import React from "react"

const page = async () => {
  const user = await getCurrentUser({ redirectIfNotFound: true })
  console.log(user)
  return <div>Secret Page</div>
}

export default page
