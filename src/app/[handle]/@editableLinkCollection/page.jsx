"use client"

import { useContext, useState } from "react"
import { Profile } from "../page.jsx"

// to define the handle and linkCollectionIsSortable
import { ProfilePageContext } from "@/app/[handle]/utils/ProfilePageContext"

// import state of link collection
import { LinkCollectionEntries } from "@/lib/features/profilePage/linkCollectionEntries"

// imports for UI /.
import { Button } from "@/components/ui/button"
// imports for UI ./

export default function Page() {
  return (
    <Profile>
      <LinkCollection />
    </Profile>
  )
}

const sectionTitle = "Links"

function LinkCollection() {
  // on top to solve "Error: React Hook "useState" is called conditionally.
  // React Hooks must be called in the exact same order in every
  // component render."

  const { linkCollectionIsSortable, setLinkCollectionIsSortable } =
    useContext(ProfilePageContext)

  const { handle } = useContext(ProfilePageContext)
  if (!handle) {
    return (
      <>
        <h2 className="section-title">{sectionTitle}</h2>
        <div>Loading...</div>
      </>
    )
  }

  if (linkCollectionIsSortable) {
    // drag-and-drop HTML
    return (
      <LinkCollectionEntries
        handle={handle}
        mode={"draggable"}
        sectionTitle={sectionTitle}
      />
    )
  } else {
    // default HTML
    return (
      <>
        <LinkCollectionEntries
          handle={handle}
          mode={"editable"}
          sectionTitle={sectionTitle}
        />
        <div className="flex justify-end">
          <Button
            id="activateReorderLinkCollectionButton"
            variant="outline"
            className="bg-white text-black"
            onClick={() => setLinkCollectionIsSortable(true)}
          >
            change order
          </Button>
        </div>
      </>
    )
  }
}
