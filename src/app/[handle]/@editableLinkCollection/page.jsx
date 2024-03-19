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
      <EditableLinkCollectionWithContext />
    </Profile>
  )
}

function EditableLinkCollectionWithContext() {
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

  // new state variables
  // const [linkCollectionIsSortable, setLinkCollectionIsSortable] =
  //   useState(false)
  // new list - will be used to populate data and V-DOM
  const [listOfLinkCollectionEntries, setListOfLinkCollectionEntries] =
    useState(linkedCollection.contentBox.map((link) => link))
  announce("populated link collection list", listOfLinkCollectionEntries)

  // default HTML
  return (
    <>
      <b>{sectionTitle}</b>
      <EditableLinkCollection
        linkCollection={listOfLinkCollectionEntries}
        setLinkCollection={setListOfLinkCollectionEntries}
      />
      <div className="flex justify-end">
        <Button
          id="activateReorderLinkCollectionButton"
          variant="outline"
          className="bg-white text-black"
        >
          change order
        </Button>
      </div>
    </>
  )

  // OLD CODE BELOW - to be removed
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

    return (
      <div key={"linkItem-" + link.position}>
        <Dialog>
          <DialogTrigger asChild>
            <div className="group/edit">
              <div
                key={"pos-" + link.position + "-editable"}
                className="my-4 mx-2 py-0.5 px-3 bg-konkikyou-blue group/edit"
              >
                <a>
                  <IconMapper url={link.url} />
                  <span id={"linkText-" + link.position} className="mx-2">
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
  // end of innerHTML mapping

  return (
    <>
      <b>{sectionTitle}</b>

      {/* <div className="flex justify-between">
        <b>{sectionTitle}</b>
        <Button variant="outline" className="bg-white text-black">
          change order
        </Button>
      </div> */}

      <>{innerHTML}</>
      <div className="flex justify-end">
        <Button
          id="activateReorderLinkCollectionButton"
          variant="outline"
          className="bg-white text-black"
        >
          change order
        </Button>
      </div>
    </>
  )
}

export function EditableLinkCollection({ linkCollection, setLinkCollection }) {
  return linkCollection.map((link) => {
    const [linkText, setLinkText] = useState(link.text)
    const [linkUrl, setLinkUrl] = useState(link.url)

    return (
      <div key={"linkItem-" + link.position}>
        <Dialog>
          <DialogTrigger asChild>
            <div className="group/edit">
              <div
                key={"pos-" + link.position + "-editable"}
                className="my-4 mx-2 py-0.5 px-3 bg-konkikyou-blue group/edit"
              >
                <a>
                  <IconMapper url={link.url} />
                  <span id={"linkText-" + link.position} className="mx-2">
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
                  id={"linkTextInput-" + link.position}
                  type="text"
                  className="col-span-3"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="linkUrl" className="text-right">
                  Link
                </Label>
                <Input
                  id={"linkUrlInput-" + link.position}
                  type="text"
                  className="col-span-3"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose>
                <Button
                  type="submit"
                  onClick={() => sendLinkInputToUpdate(link.position)}
                >
                  Save changes
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  })
}

// Network interactions /.
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
// Network interactions ./

// Data manipulations /.
function updateLinkCollection(linkText, linkUrl, linkPosition) {
  // save to backend
  handleDataUpdate(linkText, linkUrl, linkPosition)

  // TODO: only continue on successful save!
  console.log(
    `%c linkText=${linkText}, linkURL=${linkUrl}, linkPosition=${linkPosition}`,
    "color: cyan; background-color: black; font-size: 16px; padding: 4px; border-radius: 4px;"
  )

  // re-render featured content (show changes)
  document.getElementById("linkText-" + linkPosition).innerHTML =
    linkText.length > 0 ? linkText : linkUrl
}
// Data manipulations ./

// Mixed V-DOM & data manipulations /.
function sendLinkInputToUpdate(linkPosition) {
  let bufferText = document.getElementById(
    "linkTextInput-" + linkPosition
  ).value
  console.log("bufferText= " + bufferText)

  let bufferUrl = document.getElementById("linkUrlInput-" + linkPosition).value
  console.log("bufferURL= " + bufferUrl)

  updateLinkCollection(bufferText, bufferUrl, linkPosition)
}
// Mixed V-DOM & data manipulations ./

// Support functions (debug) /.
function announce(announcement, objectToLog) {
  let colorCode = ""

  switch (announcement) {
    case "got tags from API":
      colorCode = "#eee600" // titanium yellow
      break

    case "populated link collection list":
      colorCode = "#ffe4c4" // bisque
      break

    case "string of tags got some values":
      colorCode = "#00ff00" // lime
      break

    case "user popped tag with id =>":
      colorCode = "#da70d6" // orchid
      break

    case "user is saving tag with text [parameter]: ":
    case "user is saving tag with text [state variable]: ":
    case "user is saving tag with text [getById]: ":
      colorCode = "#00ffff" // cyan
      break

    default:
      colorCode = "#7fffd4" // green
      break
  }

  console.log(`%c /////////////////`, `color: ${colorCode}; font-size: 20px;`)
  console.log(`%c ${announcement}`, `color: ${colorCode};`)

  if (objectToLog != null) {
    console.log(
      `%c objectToLog type => ${typeof objectToLog}`,
      `color: ${colorCode};`
    )
    console.log(`%c objectToLog => ${objectToLog}`, `color: ${colorCode};`)
    console.log(`%c as a table:`, `color: ${colorCode};`)
    console.table(objectToLog)
  } else {
    console.log(`%c alert: no object to log!!`, `color: ${colorCode};`)
  }
}
// Support functions (debug) ./
