import { cache } from "react"
import { getUserFromSession } from "../core/session"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

// ReturnType is used to get return type of getUserFromDatabase (user|null). Awaited is used since getUserFromDatabase is async. Exclude removes unwanted types, in this case is undefined and null.
type FullUser = Exclude<
  Awaited<ReturnType<typeof getUserFromDatabase>>,
  undefined | null
>

type User = Exclude<
  Awaited<ReturnType<typeof getUserFromSession>>,
  undefined | null
>

//typescript overloading to allow different input shapes and return types
function _getCurrentUser(options: {
  withFullUser: true
  redirectIfNotFound: true
}): Promise<FullUser>
function _getCurrentUser(options: {
  withFullUser: true
  redirectIfNotFound?: false
}): Promise<FullUser | null>
function _getCurrentUser(options: {
  withFullUser?: false
  redirectIfNotFound: true
}): Promise<User>
function _getCurrentUser(options?: {
  withFullUser?: false
  redirectIfNotFound?: false
}): Promise<User | null>
async function _getCurrentUser({
  withFullUser = false,
  redirectIfNotFound = false,
} = {}) {
  const user = await getUserFromSession(await cookies())

  if (user == null) {
    if (redirectIfNotFound) return redirect("/login")
    return null
  }

  if (withFullUser) {
    const fullUser = await getUserFromDatabase(user.id)

    if (fullUser == null) throw new Error("User not found in database")
    return fullUser
  }

  return user
}

export const getCurrentUser = cache(_getCurrentUser)

async function getUserFromDatabase(id: string) {
  const user = await db.user.findFirst({
    where: {
      id: id,
    },
  })

  return user
}
