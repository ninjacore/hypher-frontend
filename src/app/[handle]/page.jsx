"use client"
import React, { createContext, useEffect, useState } from "react"

// to derive handle
import { usePathname } from "next/navigation"
import { deriveProfileHandle } from "@/lib/utils/profileHandleDeriver"
import path from "path"

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

  // to limit re-renders
  useEffect(() => {
    setHandle(pathname.split("/").pop())
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
