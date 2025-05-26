import React from "react"
import Link from "next/link"
import ThemeSwitch from "./Themeswitch"
import HamburgerMenu from "./HamburgerMenu"

const Navbar = () => {
  return (
    <nav className="navbar fixed top-0 z-20 flex w-full h-20 p-4 md:p-0 flex items-center justify-center bg-white dark:bg-slate-800 shadow-xl">
      <div className="w-full md:w-5/6 lg:w-3/4 lg:max-w-6xl flex items-center justify-center">
        <Link href="/" className={`text-4xl font-bold`}>
          Technically
        </Link>
        <HamburgerMenu />
        <ThemeSwitch />
      </div>
    </nav>
  )
}

export default Navbar
