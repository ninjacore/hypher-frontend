"use client"

import { useContext } from "react"
import { Profile } from "../page.jsx"

// to define the handle
import { ProfilePageContext } from "../ProfilePageContext"

import { IconMapper } from "@/components/iconMapper"

// import state of link collection
import { LinkCollectionEntries } from "@/lib/features/profilePage/linkCollectionEntries"

export default function Page() {
  return (
    <Profile>
      <LinkCollection />
    </Profile>
  )
}

function LinkCollection() {
  const { handle } = useContext(ProfilePageContext)
  if (!handle) {
    return <div>Loading...</div>
  }

  // providing handle for Redux
  return (
    <>
      <LinkCollectionEntries handle={handle} />
    </>
  )
}
