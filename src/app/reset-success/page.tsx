import React from "react"

const ResetSuccessPage = () => {
  return (
    <div className="max-w-md mx-auto mt-20 text-center p-6 border rounded-lg shadow dark:bg-slate-800">
      <h1 className="text-2xl font-bold mb-4 text-green-600">
        Password Reset Successful
      </h1>
      <p className="mb-6">
        Your password has been updated. You may now sign in using your new
        credentials.
      </p>
      <a
        href="/login"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Go to Login
      </a>
    </div>
  )
}

export default ResetSuccessPage
