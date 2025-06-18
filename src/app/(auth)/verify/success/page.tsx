import Link from "next/link"
import React from "react"

const emailVerifiedPage = () => {
  return (
    <div>
      <p>
        Thank you for verifying your email!{" "}
        <Link href="/">Go to Dashboard</Link>
      </p>
    </div>
  )
}

export default emailVerifiedPage
