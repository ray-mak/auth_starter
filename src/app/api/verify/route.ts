import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  if (!token)
    return NextResponse.json({ error: "Missing token" }, { status: 400 })

  const user = await db.user.findFirst({
    where: {
      verifyToken: token,
      verifyTokenExpires: {
        gt: new Date(),
      },
    },
  })

  if (!user)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/verify/expired`
    )

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      isVerified: true,
      verifyToken: null,
      verifyTokenExpires: null,
    },
  })

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/verify/success`
  )
}
