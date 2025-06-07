"use client"

import SignUpForm from "@/components/SignUpForm"
import React, { useState } from "react"

const page = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <SignUpForm />
      </div>
    </div>
  )
}

export default page
