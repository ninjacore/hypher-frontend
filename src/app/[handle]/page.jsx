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
  // let handle = null
  const pathname = usePathname()

  // const [pathname, setPathname] = useState(null)
  // setPathname(usePathname())

  // get handle from url of this page
  // const pathname =
  //   const handle = deriveProfileHandle(pathname)

  // to limit re-renders
  useEffect(() => {
    console.log("pathname is set to: ", pathname)
    console.log("pathname.split('/').pop(1) = ", pathname.split("/").pop(1))
    // setHandle(pathname.split("/").pop(1))
    // handle = pathname.split("/").pop(1)
    setHandle(pathname.split("/").pop(1))

    // setHandle(deriveProfileHandle(pathname))
    console.log("handle is set to: ", handle)
  }, [pathname])

  //   setHanlde(deriveProfileHandle(pathname))

  // if (handle) {
  //   console.log("if (handle) TRUE: ", handle)
  //   return (
  //     <>
  //       <ProfileContext.Provider value={handle}>
  //         {children}
  //       </ProfileContext.Provider>
  //     </>
  //   )
  // }

  // default
  return (
    <>
      <ProfileContext.Provider value={handle}>
        {children}
      </ProfileContext.Provider>
    </>
  )
}
