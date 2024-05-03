"use client"

import { useContext, useState } from "react"
import { Profile } from "../page.jsx"

// to define the handle and linkCollectionIsSortable
import { ProfilePageContext } from "@/app/[handle]/utils/ProfilePageContext"

// import state of link collection
import { LinkCollectionEntries } from "@/lib/features/profilePage/linkCollectionEntries"

// imports for UI /.
import { IconMapper } from "@/components/iconMapper"
import { EditButton } from "@/components/ui/editButtonPen"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

  // const [linkCollectionIsSortable, setLinkCollectionIsSortable] =
  //   useState(false)

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

  // TODO: const {linkCollectionIsSortable} = useContext(ProfilePageContext)

  if (linkCollectionIsSortable) {
    // drag-and-drop HTML
    return (
      <>
        <h2 className="section-title">{sectionTitle}</h2>
        <LinkCollectionEntries handle={handle} mode={"draggable"} />
      </>
    )
  } else {
    // default HTML
    return (
      <>
        {/* should be within the same component */}
        <div className="flex justify-between">
          <h2 className="section-title">{sectionTitle}</h2>
          <Button
            variant="outline"
            className="bg-white text-black"
            // onClick={() => setEditMode(true)}
          >
            {"ADD"}
          </Button>
        </div>

        <LinkCollectionEntries handle={handle} mode={"editable"} />
        {/* should be within the same component */}

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
