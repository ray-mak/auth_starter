import { sendEmail } from "./email"

export async function sendVerificationEmail(to: string, token: string) {
  const baseUrl =
    (process.env.NEXT_PUBLIC_BASE_URL as string) || "http://localhost:3000"

  const verifyUrl = `${baseUrl}/api/verify?token=${token}`

  const html = `
    <p>Please verify your email by clicking below:</p>
      <a href="${verifyUrl}">Verify Email</a>
      <p>If the link above does not work, please copy and paste the following link into your browser.</p>
      <p>${verifyUrl}</p>
      <p>Thanks!</p>
      <p>The Technically Team</p>
    `

  return sendEmail({
    to,
    subject: "Verify your email",
    text: `Please verify your email: ${verifyUrl}`,
    html,
  })
}
