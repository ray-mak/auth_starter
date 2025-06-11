import { z } from "zod"
import { OAuthClient } from "./base"

export function createGoogleOAuthClient() {
  return new OAuthClient({
    provider: "google",
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    scopes: ["email", "openid", "profile"],
    urls: {
      auth: "https://accounts.google.com/o/oauth2/v2/auth",
      token: "https://oauth2.googleapis.com/token",
      user: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    userInfo: {
      schema: z.object({
        sub: z.string(),
        email: z.string().email().nullable(),
        email_verified: z.boolean().optional(),
        name: z.string().nullable(),
        picture: z.string().url().optional(),
        given_name: z.string().optional(),
        family_name: z.string().optional(),
        locale: z.string().optional(),
      }),
      parser: (user) => ({
        id: user.sub,
        email: user.email ?? user.sub,
        name: user.name ?? user.email ?? user.sub,
      }),
    },
  })
}
