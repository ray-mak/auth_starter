import { isRateLimited } from "@/lib/rateLimiter"
import { sendPasswordReset } from "@/lib/resetPasswordEmail"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email)
    return NextResponse.json({ error: "Missing email" }, { status: 400 })

  const limited = await isRateLimited(`reset-password:${email}`, 3)

  if (limited)
    return NextResponse.json(
      { error: "Too many password reset requests. Try again later." },
      { status: 429 }
    )

  const result = await sendPasswordReset(email)

  if (result.error)
    return NextResponse.json({ error: result.error }, { status: 400 })

  return NextResponse.json({ success: true }, { status: 200 })
}
