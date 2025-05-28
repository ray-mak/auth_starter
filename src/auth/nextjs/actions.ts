"use server"

import { z } from "zod"
import { signInSchema, signUpSchema } from "./schemas"
import { db } from "@/lib/db"
import { generateSalt, hashPassword } from "./core/passwordHasher"
import { redirect } from "next/navigation"
import { createUserSession } from "./core/session"
import { cookies } from "next/headers"

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
  const { success, data } = signUpSchema.safeParse(unsafeData)

  if (!success) return { error: "Error creating account" }

  const existingUsername = await db.user.findFirst({
    where: { username: data.username },
  })

  const existingEmail = await db.user.findFirst({
    where: {
      email: data.email,
    },
  })

  if (existingEmail != null || existingUsername != null)
    return { error: "Account with this username or email already exists" }

  try {
    const salt = generateSalt()

    const hashedPassword = await hashPassword(data.password, salt)

    const user = await db.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        salt: salt,
      },
    })

    if (user == null) return { error: "Error creating account" }

    await createUserSession(user, await cookies())

    return { success: true }
  } catch (error) {
    console.error("Sign-up failed:", error)
    return { error: "Error creating account" }
  }

  // redirect("/")
}
