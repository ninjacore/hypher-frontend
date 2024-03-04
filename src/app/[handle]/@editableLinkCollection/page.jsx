"use client"

import { useContext, useState, useEffect, use } from "react"

import { ProfileContext, Profile } from "../page.jsx"
import { IconMapper } from "../../../components/iconMapper"
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
import { Card } from "@/components/ui/card"

export default function Page() {
  return (
    <Profile>
      <EditableLinkCollection />
    </Profile>
  )
}

function EditableLinkCollection() {
  const sectionTitle = "LET'S CONNECT"

  const profile = useContext(ProfileContext)
  // Check if profile or mainProfileData is not yet defined and return null or a loading state
  if (!profile || !profile.mainProfileData) {
    // You can return a loading spinner, a placeholder, or null to avoid rendering this component prematurely
    return <div>Loading...</div> // or return null;
  }
  const { linkCollectionData } = profile
  const linkedCollection = linkCollectionData

  console.log("linkedCollection.contentBox=")
  console.table(linkedCollection.contentBox)

  const innerHTML = linkedCollection.contentBox.map((link) => {
    // pre-load from context if available
    let defaultLinkText = ""
    let defaultLinkURL = ""

    if (link.text.length > 0) {
      defaultLinkText = link.text
    }
    if (link.url.length > 0) {
      defaultLinkURL = link.url
    }

    // for the input fields
    const [linkText, setLinkText] = useState(defaultLinkText)
    const [linkURL, setLinkURL] = useState(defaultLinkURL)

    //   return (
    //     <>
    //       <div
    //         key={"pos-" + link.position + "-editable"}
    //         className="my-4 mx-2 py-2 px-3 bg-konkikyou-blue group/edit"
    //       >
    //         <a>
    //           <IconMapper url={link.url} />
    //           <span className="mx-2">
    //             {link.text.length > 0 ? link.text : link.url}
    //           </span>
    //         </a>
    //         <EditButton />
    //       </div>
    //     </>
    //   )
    // }, [])

    return (
      <div key={"link-" + link.position}>
        <Dialog>
          <DialogTrigger asChild>
            <div className="group/edit">
              <div
                key={"pos-" + link.position + "-editable"}
                className="my-4 mx-2 py-0.5 px-3 bg-konkikyou-blue group/edit"
              >
                <a>
                  <IconMapper url={link.url} />
                  <span className="mx-2">
                    {link.text.length > 0 ? link.text : link.url}
                  </span>
                </a>
                <EditButton />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Link</DialogTitle>
              <DialogDescription>
                Make changes to your link here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="linkText" className="text-right">
                  Text
                </Label>
                <Input
                  id="linkText"
                  type="text"
                  className="col-span-3"
                  onChange={(e) => setLinkText(e.target.value)}
                  value={linkText}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="linkURL" className="text-right">
                  Link
                </Label>
                <Input
                  id="linkURL"
                  type="text"
                  className="col-span-3"
                  onChange={(e) => setLinkURL(e.target.value)}
                  value={linkURL}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose>
                <Button
                  type="submit"
                  onClick={(e) => {
                    updateLinkCollection(linkText, linkURL, link.position)
                  }}
                >
                  Save changes
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }, [])
  return (
    <>
      <b>{sectionTitle}</b>
      <>{innerHTML}</>
    </>
  )
}

function updateLinkCollection(linkText, linkURL, linkPosition) {
  // save to backend
  handleDataUpdate(linkText, linkURL, linkPosition)

  // TODO: only continue on successful save!
  console.log(
    `%c linkText=${linkText}, linkURL=${linkURL}, linkPosition=${linkPosition}`,
    "color: cyan; background-color: black; font-size: 16px; padding: 4px; border-radius: 4px;"
  )
}

function editLink(event, linkPosition) {
  console.log(
    `%c ${event.target}`,
    "color: cyan; background-color: black; font-size: 16px; padding: 4px; border-radius: 4px;"
  )

  console.log(
    `%c link at position ${linkPosition} is getting edited!!`,
    "color: cyan; background-color: black; font-size: 16px; padding: 4px; border-radius: 4px;"
  )
}

function handleDataUpdate(linkText, linkURL, linkPosition) {
  // get handle from url of this page
  const url = window.location.href
  const handle = url.split("/").pop()
  console.log("handle=")
  console.log(handle)

  const apiURL = `http://localhost:5678/api/v1/linkCollections/${handle}/update?position=${linkPosition}`

  fetch(apiURL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: linkText,
      url: linkURL,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data)
      return data
    })
    .catch((error) => {
      console.error("Error:", error)
      return error
    })
}
