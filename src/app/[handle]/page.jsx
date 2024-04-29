"use client"
import React, { useEffect, useState } from "react"

// to derive handle
import { usePathname } from "next/navigation"

// importing context to use later and in child components
import { ProfilePageContext } from "@/app/[handle]/utils/ProfilePageContext"

export default function Page() {
  return (
    <>
      <Profile />
    </>
  )
}

export function Profile({ children }) {
  // Profile Page Context variables /.
  const [handle, setHandle] = useState(null)

  const [linkCollectionIsSortable, setLinkCollectionIsSortable] =
    useState(false)
  // Profile Page Context variables ./

  // get handle from url of this page
  const pathname = usePathname()

  // to limit re-renders
  useEffect(() => {
    setHandle(pathname.split("/").pop())
    console.log("setting handle: ", handle)
  }, [])

  if (handle) {
    return (
      <>
        <ProfilePageContext.Provider
          value={{
            handle,
            linkCollectionIsSortable,
            setLinkCollectionIsSortable,
          }}
        >
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
