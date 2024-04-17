"use client"

import { useContext, useEffect, useState } from "react"
// import { ProfilePageContext } from "../ProfilePageContext"
import { Profile } from "../page.jsx"
import { ProfilePageContext } from "../ProfilePageContext"

import { IconMapper } from "@/components/iconMapper"

// to define the handle
// import { deriveProfileHandle } from "@/lib/utils/profileHandleDeriver.js"
import { usePathname } from "next/navigation"

// import state of link collection
// import { LinkCollectionEntries } from "@/lib/legacy/v1/features/profile/linkCollectionEntries"
import { LinkCollectionEntries } from "@/lib/features/profilePage/linkCollectionEntries"

// export default function Page() {
//   // provding handle for Redux
//   const url = window.location.href
//   let handle = url.split("/").pop()

//   return (
//     <Profile>
//       {/* <LinkCollection /> */}
//       <LinkCollectionEntries handle={handle} />
//     </Profile>
//   )
// }

export default function Page() {
  // provding handle for Redux
  // const url = window.location.href
  // let handle = url.split("/").pop()

  return (
    <Profile>
      <LinkCollection />
      {/* <LinkCollectionEntries handle={handle} /> */}
    </Profile>
  )
}

function LinkCollection() {
  const { handle } = useContext(ProfilePageContext)
  if (!handle) {
    return <div>Loading...</div>
  }

  return (
    <>
      <LinkCollectionEntries handle={handle} />
    </>
  )
}
