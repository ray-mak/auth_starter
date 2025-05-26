"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons"

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState<boolean>(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="relative">
        <div className="w-8 h-4 rounded-3xl"></div>
      </div>
    )
  }
  return (
    <button
      type="button"
      className="relative ml-auto mr-16 md:mr-0 md:ml-8"
      aria-label="toggle dark mode"
    >
      <div
        className={`${
          resolvedTheme === "light" ? "bg-gray-300" : "bg-slate-600"
        } w-8 h-4 rounded-3xl`}
      ></div>
      <div
        className={`theme-button ${
          resolvedTheme === "light" ? "" : "darkmode"
        }  flex items-center justify-center`}
        onClick={
          resolvedTheme === "light"
            ? () => setTheme("dark")
            : () => setTheme("light")
        }
      >
        {resolvedTheme === "light" ? (
          <FontAwesomeIcon icon={faMoon} style={{ color: "#FFD43B" }} />
        ) : (
          <FontAwesomeIcon icon={faSun} style={{ color: "#556e82" }} />
        )}
      </div>
    </button>
  )
}
