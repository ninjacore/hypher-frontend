"use client"

import { useContext } from "react"
import { Profile } from "../page.jsx"

// to define the handle
import { ProfilePageContext } from "@/app/[handle]/utils/ProfilePageContext"

// import state of link collection
import { FeaturedContentEntries } from "@/lib/features/profilePage/featuredContentEntries"

export default function Page() {
  return (
    <Profile>
      <EditableFeaturedContent />
    </Profile>
  )
}

const sectionTitle = "Featured"

function EditableFeaturedContent() {
  const { handle } = useContext(ProfilePageContext)
  if (!handle) {
    return <div>Loading...</div>
  }

  // providing handle for Redux
  return (
    <>
      <FeaturedContentEntries
        handle={handle}
        mode={"editable"}
        sectionTitle={sectionTitle}
      />
    </>
  )
}
