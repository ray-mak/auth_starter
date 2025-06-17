import { randomBytes } from "crypto"
import { db } from "./db"
import { sendEmail } from "./email"

export async function sendPasswordReset(to: string) {
  const token = randomBytes(32).toString("hex").normalize()

  const baseUrl =
    (process.env.NEXT_PUBLIC_BASE_URL as string) || "http://localhost:3000"

  const resetUrl = `${baseUrl}api/reset-password?token=${token}`

  const user = await db.user.findFirst({
    where: {
      email: to,
    },
  })

  if (!user) {
    return { error: "User does not exist" }
  }

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetToken: token,
      resetTokenExpires: new Date(Date.now() + 60 * 60 * 1000),
    },
  })

  const html = `
      <p>Hello,</p>

<p>We received a request to reset your password. You can reset it by clicking the link below:</p>

<p><a href="${resetUrl}">Reset Password</a></p>

<p>If the above link doesn’t work, please copy and paste this URL into your browser:</p>

<p>${resetUrl}</p>

<p>This link will expire in 1 hour.</p>

<p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>

<p>Thank you,<br />The Technically Team</p>
      `

  return sendEmail({
    to,
    subject: "Reset your password",
    text: `Please reset your password: ${resetUrl}`,
    html,
  })
}
