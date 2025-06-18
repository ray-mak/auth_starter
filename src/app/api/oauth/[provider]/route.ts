import { getOAuthClient } from "@/auth/core/oauth/base"
import { createUserSession } from "@/auth/core/session"
import { db } from "@/lib/db"
import { OAuthProviders } from "@prisma/client"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"
import { z } from "zod"
import { cookies } from "next/headers"

// const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const { provider: rawProvider } = await params

  const code = request.nextUrl.searchParams.get("code")
  const state = request.nextUrl.searchParams.get("state")
  const provider = z.enum(["google", "github", "discord"]).parse(rawProvider)

  if (typeof code !== "string" || typeof state !== "string") {
    redirect(
      `/sign-in?oauthError=${encodeURIComponent(
        "Failed to connect. Please try again."
      )}`
    )
  }

  const oAuthClient = getOAuthClient(provider)
  try {
    const oAuthUser = await oAuthClient.fetchUser(code, state, await cookies())
    const user = await connectUserToAccount(oAuthUser, provider)
    await createUserSession(user, await cookies())
  } catch (error) {
    console.error(error)
    redirect(
      `/sign-in?oauthError=${encodeURIComponent(
        "Failed to connect. Please try again."
      )}`
    )
  }
  redirect("/")
}

function connectUserToAccount(
  { id, email, name }: { id: string; email: string; name: string },
  provider: OAuthProviders
) {
  return db.$transaction(async (tx) => {
    let user = await tx.user.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
        role: true,
      },
    })

    if (user == null) {
      user = await tx.user.create({
        data: {
          email,
          name,
        },
        select: {
          id: true,
          role: true,
        },
      })
    }

    try {
      await tx.oAuthAccount.create({
        data: {
          provider,
          providerId: id,
          userId: user.id,
        },
      })
    } catch (error: any) {
      if (error.code !== "P2002") {
        throw error
      }
    }

    return user
  })
}
