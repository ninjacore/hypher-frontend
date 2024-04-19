"use client"

import { useContext, useState } from "react"
import { Profile } from "../page.jsx"

// to define the handle
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
  const { handle } = useContext(ProfilePageContext)
  if (!handle) {
    return (
      <>
        <h2 className="section-title">{sectionTitle}</h2>
        <div>Loading...</div>
      </>
    )
  }

  const [linkCollectionIsSortable, setLinkCollectionIsSortable] =
    useState(false)

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
        <h2 className="section-title">{sectionTitle}</h2>
        <LinkCollectionEntries handle={handle} mode={"editable"} />
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
