"use client"

import { useContext, useState } from "react"
// import { ProfileContext, Profile } from "../ProfileProvider"
import { ProfileContext, Profile } from "../page.jsx"
import { IconMapper } from "../../../components/iconMapper"
import { Card } from "@/components/ui/card"
import { EditButton } from "@/components/ui/editButtonPen"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <Profile>
      <EditableFeatured />
    </Profile>
  )
}

function EditableFeatured() {
  const profile = useContext(ProfileContext)
  // Check if profile or mainProfileData is not yet defined and return null or a loading state
  if (!profile || !profile.mainProfileData) {
    // You can return a loading spinner, a placeholder, or null to avoid rendering this component prematurely
    return <div>Loading...</div> // or return null;
  }
  const { featuredContentData } = profile
  const featuredContent = featuredContentData

  console.log("featuredContent.contentBox=")
  console.table(featuredContent.contentBox)
  console.log("featuredContent")
  console.log(featuredContent)

  // for the input fields
  const [featuredTitle, setFeaturedTitle] = useState("")
  const [featuredLink, setFeaturedLink] = useState("")
  const [featuredDescription, setFeaturedDescription] = useState("")

  let title = featuredContent.shortTitle
  const innerHTML = featuredContent.contentBox.map((contentBox) => {
    return (
      <Card key={contentBox.category + contentBox.position} className="my-4">
        {/* <a onClick={(e) => editLink(e, 2)} id={contentBox.position + "x"}> */}
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex group/edit">
              <div className="text-5xl py-4 px-2">
                <IconMapper url={contentBox.category + ":"} />
              </div>
              <div className="grow p-2">
                <span>
                  {contentBox.title.length > 0 ? contentBox.title : ""}
                </span>
                <EditButton />
                <br />
                <span>
                  {contentBox.description.length > 0
                    ? contentBox.description
                    : contentBox.url}
                </span>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Content</DialogTitle>
              <DialogDescription>
                Make changes to your content here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="featuredTitle" className="text-right">
                  Title
                </Label>
                <Input
                  id="featuredTitle"
                  type="text"
                  className="col-span-3"
                  onChange={(e) => setFeaturedTitle(e.target.value)}
                  value={featuredTitle}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="featuredLink" className="text-right">
                  Link
                </Label>
                <Input
                  id="featuredLink"
                  type="text"
                  className="col-span-3"
                  onChange={(e) => setFeaturedLink(e.target.value)}
                  value={featuredLink}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="featuredDescription" className="text-right">
                  Description
                </Label>
                <Input
                  id="featuredDescription"
                  type="text"
                  className="col-span-3"
                  onChange={(e) => setFeaturedDescription(e.target.value)}
                  value={featuredDescription}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    )
  }, [])
  return (
    <>
      <b>{title}</b>
      <div className="">{innerHTML}</div>
    </>
  )
}

function editLink(event, contentBoxPosition) {
  console.log(
    `%c ${event.target}`,
    "color: cyan; background-color: black; font-size: 16px; padding: 4px; border-radius: 4px;"
  )

  console.log(
    `%c link at position ${contentBoxPosition} is getting edited!!`,
    "color: cyan; background-color: black; font-size: 16px; padding: 4px; border-radius: 4px;"
  )
}
