"use client"
import Link from "next/link"
import React, { useState } from "react"

const HamburgerMenu = () => {
  const [hamburgerMenu, setHamburgerMenu] = useState(false)
  function toggleHamburger() {
    setHamburgerMenu((prevState) => !prevState)
  }

  function closeHamburger() {
    setHamburgerMenu(false)
  }
  return (
    <>
      <div
        onClick={toggleHamburger}
        className={`hamburger ${hamburgerMenu ? "opened" : ""}`}
      >
        <span className="bar bg-slate-900 dark:bg-slate-300"></span>
        <span className="bar bg-slate-900 dark:bg-slate-300"></span>
        <span className="bar bg-slate-900 dark:bg-slate-300"></span>
      </div>
      <div className={`dimmer ${hamburgerMenu ? "opened" : ""}`}></div>
      <div
        className={`navmenu bg-white dark:bg-slate-800 md:bg-inherit flex gap-6 ml-auto items-center justify-center md:text-sm lg:text-base ${
          hamburgerMenu ? "opened" : ""
        } `}
      >
        <Link
          href="/login"
          className="text-sm font-bold hover:bg-slate-100 px-4 py-2 rounded-md dark:hover:bg-slate-700"
        >
          LOG IN
        </Link>
        <Link
          href="/signup"
          className="text-SM font-bold border bg-slate-200 dark:bg-slate-900 px-4 py-2 rounded-md hover:bg-slate-300"
        >
          SIGN UP
        </Link>
      </div>
    </>
  )
}

export default HamburgerMenu
