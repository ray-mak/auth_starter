import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

type Email = {
  to: string
  subject: string
  text: string
  html: string
}

export async function sendEmail(email: Email) {
  const msg = {
    to: email.to,
    from: process.env.SENDGRID_FROM_EMAIL as string,
    subject: email.subject,
    text: email.text,
    html: email.html,
  }

  try {
    await sgMail.send(msg)
    return { success: true }
  } catch (error) {
    console.error("Sendgrid error: ", error)
    return { error: "Error sending email" }
  }
}
