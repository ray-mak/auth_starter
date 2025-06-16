import { sendEmail } from "@/lib/email"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { to } = await req.json()
  const result = await sendEmail({
    to: to,
    subject: "Test",
    text: "Test",
    html: "<h1>Test</h1>",
  })

  return NextResponse.json(result)
}
