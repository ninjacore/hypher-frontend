"use client"
import React, { createContext, useEffect, useState } from "react"

// to derive handle
import { usePathname } from "next/navigation"
import { deriveProfileHandle } from "@/lib/utils/profileHandleDeriver"

// creating context to use later and in child components
export const ProfileContext = createContext(null)

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
  //   const handle = deriveProfileHandle(pathname)

  // to limit re-renders
  useEffect(() => {
    setHandle(deriveProfileHandle(pathname))
  }, [])

  //   setHanlde(deriveProfileHandle(pathname))

  if (handle) {
    return (
      <>
        <ProfileContext.Provider value={handle}>
          {children}
        </ProfileContext.Provider>
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
