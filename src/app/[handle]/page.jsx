"use client"
import React, { useEffect, useState } from "react"

// to derive handle
import { usePathname } from "next/navigation"

// importing context to use later and in child components
import { ProfilePageContext } from "./ProfilePageContext"

export default function Page() {
  return (
    <>
      <Profile />
    </>
  )
}

export function Profile({ children }) {
  const [handle, setHandle] = useState(null)

  // get handle from url of this page
  const pathname = usePathname()

  // to limit re-renders
  useEffect(() => {
    setHandle(pathname.split("/").pop())
  }, [])

  if (handle) {
    return (
      <>
        <ProfilePageContext.Provider value={{ handle }}>
          {children}
        </ProfilePageContext.Provider>
      </>
    )
  }

  // default
  return (
    <>
      <span>Loading..</span>
    </>
  )
}
