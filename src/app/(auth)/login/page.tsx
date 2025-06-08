import React from "react"
import SignInPageClient from "./SignInPageClient"

const SignInPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ oauthError?: string }>
}) => {
  const { oauthError } = await searchParams

  return <SignInPageClient oauthError={oauthError} />
}

export default SignInPage
