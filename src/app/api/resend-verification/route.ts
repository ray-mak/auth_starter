import { resendEmailVerification } from "@/lib/resendEmailVerification"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email } = await req.json()
  const result = await resendEmailVerification(email)

  console.log(result)

  return NextResponse.json(result)
}
