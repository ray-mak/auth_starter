"use client"

import LoginForm from "@/components/LoginForm"

const SignInPageClient = ({ oauthError }: { oauthError?: string }) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        {oauthError && <p>{oauthError}</p>}
        <LoginForm />
      </div>
    </div>
  )
}

export default SignInPageClient
