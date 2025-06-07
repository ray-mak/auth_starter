import { Cookies } from "../session"

export class OAuthClient<T> {
  private get redirectUrl() {
    return new URL("discord", process.env.OAUTH_REDIRECT_URL_BASE as string)
  }
  createAuthUrl(cookies: Pick<Cookies, "set">) {
    const url = new URL("https://discord.com/oauth2/authorize")

    url.searchParams.set("client_id", process.env.DISCORD_CLIENT_ID as string)

    console.log(this.redirectUrl.toString)
    url.searchParams.set("redirect_uri", this.redirectUrl.toString())
    url.searchParams.set("response_type", "code")
    url.searchParams.set("scope", "identify email")

    return url.toString()
  }
}
