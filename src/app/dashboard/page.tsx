import { getCurrentUser } from "@/auth/nextjs/currentUser"
import React from "react"

const page = async () => {
  const user = await getCurrentUser({ redirectIfNotFound: true })
  return <div>Secret Page</div>
}

export default page
