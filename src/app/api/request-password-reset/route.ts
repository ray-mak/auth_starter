import { sendPasswordReset } from "@/lib/resetPasswordEmail"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email } = await req.json()
  const result = await sendPasswordReset(email)

  if (result.error)
    return NextResponse.json({ error: result.error }, { status: 400 })

  return NextResponse.json({ success: true }, { status: 200 })
}
