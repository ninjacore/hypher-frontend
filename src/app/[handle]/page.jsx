"use client"
import React, { createContext, useEffect, useState } from "react"

import { usePathname } from "next/navigation" // to derive handle

export default function Page() {
  return (
    <>
      <Profile />
    </>
  )
}

export function Profile({ children }) {
  const [rawProfileData, setRawProfileData] = useState(null)
  const [profileDataLoaded, setProfileDataLoaded] = useState(false)

  // get handle from url of this page
  const pathname = usePathname()
  const handle = pathname.split("/").pop() // handle is first thing before slash
  console.log("handle=")
  console.log(handle)

  return <>{handle}</>
}
