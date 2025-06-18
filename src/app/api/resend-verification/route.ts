import { isRateLimited } from "@/lib/rateLimiter"
import { resendEmailVerification } from "@/lib/resendEmailVerification"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email)
    return NextResponse.json({ error: "Missing email" }, { status: 400 })

  const limited = await isRateLimited(`verify-password:${email}`, 3)

  if (limited)
    return NextResponse.json(
      { error: "Too many password reset requests. Try again later." },
      { status: 429 }
    )

  const result = await resendEmailVerification(email)

  console.log(result)

  return NextResponse.json(result)
}
