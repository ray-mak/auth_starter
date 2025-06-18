"use server"

import { z } from "zod"
import { signInSchema, signUpSchema, updatePasswordSchema } from "./schemas"
import { db } from "@/lib/db"
import {
  comparePassword,
  generateSalt,
  hashPassword,
} from "../core/passwordHasher"
import { redirect } from "next/navigation"
import { createUserSession, deleteUserSession } from "../core/session"
import { cookies } from "next/headers"
import { getOAuthClient } from "../core/oauth/base"
import { OAuthProviders } from "@prisma/client"
import { randomBytes } from "crypto"
import { sendVerificationEmail } from "@/lib/verifyEmail"

// const prima = new PrismaClient()

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const { success, data } = signInSchema.safeParse(unsafeData)

  if (!success)
    return { error: "Invalid email/username or password combination" }

  let user

  if (data.identifier.includes("@")) {
    user = await db.user.findFirst({
      where: {
        email: data.identifier,
      },
    })
  } else {
    user = await db.user.findFirst({
      where: {
        username: data.identifier,
      },
    })
  }

  if (user == null || user.password == null || user.salt == null)
    return { error: "No user found with that username or email." }

  const isPasswordValid = await comparePassword(
    data.password,
    user.salt,
    user.password
  )

  if (!isPasswordValid) return { error: "Incorrect email or password" }

  await createUserSession(user, await cookies())
}

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
    include: {
      oauthAccounts: true,
    },
  })

  if (
    existingUsername != null ||
    (existingEmail != null && existingEmail.oauthAccounts.length == 0)
  )
    return { error: "Account with this username already exists" }

  //if user already has oauth account, update account.
  if (existingEmail && existingEmail.oauthAccounts.length > 0) {
    try {
      const salt = generateSalt()
      const hashedPassword = await hashPassword(data.password, salt)

      const user = await db.user.update({
        where: {
          email: data.email,
        },
        data: {
          password: hashedPassword,
          salt: salt,
          isVerified: true,
        },
      })

      if (user == null) return { error: "Error creating account" }

      await createUserSession(user, await cookies())

      return { success: true }
    } catch (error) {
      console.error("Sign-up failed:", error)
      return { error: "Error creating account" }
    }
  }

  try {
    const salt = generateSalt()

    const hashedPassword = await hashPassword(data.password, salt)
    const verifyToken = randomBytes(32).toString("hex").normalize()

    const user = await db.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        salt: salt,
        verifyToken: verifyToken,
        verifyTokenExpires: new Date(Date.now() + 1000 * 60 * 60),
      },
    })

    if (user == null) return { error: "Error creating account" }

    await sendVerificationEmail(data.email, verifyToken)

    await createUserSession(user, await cookies())

    return { success: true }
  } catch (error) {
    console.error("Sign-up failed:", error)
    return { error: "Error creating account" }
  }

  // redirect("/")
}

//TODO: email confirmation
export async function updatePassword(
  unsafeData: z.infer<typeof updatePasswordSchema>
) {
  const { success, data } = updatePasswordSchema.safeParse(unsafeData)

  if (!success) return { error: "Error updating account" }

  const existingUser = await db.user.findFirst({
    where: {
      id: data.userId,
    },
  })

  if (!existingUser || !existingUser.salt || !existingUser.password)
    return { error: "Could not find user" }

  const isPasswordValid = await comparePassword(
    data.password,
    existingUser.salt,
    existingUser.password
  )

  if (!isPasswordValid) return { error: "Incorrect current password" }

  try {
    const salt = generateSalt()

    const hashedPassword = await hashPassword(data.newPassword, salt)

    const user = await db.user.update({
      where: {
        id: data.userId,
      },
      data: {
        password: hashedPassword,
        salt: salt,
      },
    })

    if (user == null) return { error: "Error updating account" }

    return { success: true }
  } catch (error) {
    console.error("Account update failed:", error)
    return { error: "Error updating account" }
  }
}

export async function logOut() {
  await deleteUserSession(await cookies())
}

export async function oAuthSignIn(provider: OAuthProviders) {
  const oAuthClient = getOAuthClient(provider)
  redirect(oAuthClient.createAuthUrl(await cookies()))
}
