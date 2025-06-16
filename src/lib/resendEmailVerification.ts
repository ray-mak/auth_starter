import { randomBytes } from "crypto"
import { db } from "./db"
import { sendVerificationEmail } from "./verifyEmail"

export async function resendEmailVerification(email: string) {
  const user = await db.user.findFirst({
    where: {
      email: email,
    },
  })

  if (!user || user.isVerified)
    return { error: "User does not exist or already verified" }

  const token = randomBytes(32).toString("hex").normalize()
  const expires = new Date(Date.now() + 60 * 60 * 1000)

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      verifyToken: token,
      verifyTokenExpires: expires,
    },
  })

  return await sendVerificationEmail(email, token)
}
