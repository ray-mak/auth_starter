import { generateSalt, hashPassword } from "@/auth/core/passwordHasher"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  if (!token)
    return NextResponse.json({ error: "Missing token" }, { status: 400 })

  const user = await db.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpires: {
        gt: new Date(),
      },
    },
  })

  if (!user)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/verify/expired`
    )

  return NextResponse.redirect(
    `${baseUrl}/reset-password/confirm?token=${token}`
  )
}

export async function POST(req: Request) {
  const { token, newPassword } = await req.json()

  if (!token || !newPassword)
    return NextResponse.json({ error: "Missing token or new password" })

  const user = await db.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpires: {
        gt: new Date(),
      },
    },
  })

  if (!user)
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    )

  try {
    const salt = generateSalt()

    const hashedPassword = await hashPassword(newPassword, salt)

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        salt: salt,
        resetToken: null,
        resetTokenExpires: null,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Error resetting password" },
      { status: 400 }
    )
  }

  return NextResponse.json(
    { message: "Password reset successfully" },
    { status: 200 }
  )
}
