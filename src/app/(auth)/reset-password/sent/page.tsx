import Link from "next/link"
import React from "react"

const ResetEmailSent = () => {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 text-center border rounded-lg shadow-md dark:bg-slate-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Check Your Email</h1>
      <p className="mb-4">
        If an account exists for the email you entered, we’ve sent a password
        reset link.
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Be sure to check your spam or junk folder. If you don`&#39;`t receive an
        email within a few minutes, you can try again or contact support.
      </p>

      <div className="mt-6">
        <Link
          href="/"
          className="inline-block px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}

export default ResetEmailSent
