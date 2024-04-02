"use client"

import { useId, useContext, useState, useEffect } from "react"

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

// imports for sorting functionality /.
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import { SortableLinkNode } from "./SortableLinkNode/SortableLinkNode"
// imports for sorting functionality ./

// import state of link collection
import { LinkCollectionEntries } from "@/lib/features/profile/linkCollectionEntries"

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

  // sort by position to display it correctly
  let linkCollectionByPosition = linkedCollection.contentBox.toSorted(
    (a, b) => a.position - b.position
  )

  console.log("linkedCollection.contentBox=")
  console.table(linkedCollection.contentBox)

  // new state variables
  const [linkCollectionIsSortable, setLinkCollectionIsSortable] =
    useState(false)

  // new list - will be used to populate data and V-DOM
  const [listOfLinkCollectionEntries, setListOfLinkCollectionEntries] =
    useState(linkCollectionByPosition.map((link) => link))
  announce("populated link collection list", listOfLinkCollectionEntries)

  if (linkCollectionIsSortable) {
    return (
      <>
        <b>{sectionTitle}</b>
        <p>Pick up a link to change its position in the collection.</p>

        <InEditableLinkCollection
          linkCollection={listOfLinkCollectionEntries}
          setLinkCollectionIsSortable={setLinkCollectionIsSortable}
        />
        <LinkCollectionEntries />
      </>
    )
  } else {
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
            onClick={() => setLinkCollectionIsSortable(true)}
          >
            change order
          </Button>
        </div>
        <LinkCollectionEntries />
      </>
    )
  }
}

export function InEditableLinkCollection({
  linkCollection,
  setLinkCollectionIsSortable,
}) {
  const [reorderedLinkCollection, setReorderedLinkCollection] = useState([
    linkCollection,
  ])

  return (
    <>
      <DnD
        linkCollection={linkCollection}
        setReorderedLinkCollection={setReorderedLinkCollection}
      />
      <div className="flex justify-end gap-5">
        <div>
          <Button
            id="cancelReorderedLinkCollectionButton"
            variant="outline"
            className="bg-white text-black"
            onClick={() => {
              cancelLinkCollectionUpdate(setLinkCollectionIsSortable)
            }}
          >
            cancel
          </Button>
        </div>
        <div>
          <Button
            id="saveReorderedLinkCollectionButton"
            variant="outline"
            className="bg-white text-black"
            onClick={() => {
              updateFullLinkCollection(
                reorderedLinkCollection,
                setLinkCollectionIsSortable
              )
            }}
          >
            save
          </Button>
        </div>
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
function updateLinkCollectionEntry(linkText, linkUrl, linkPosition) {
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

// V-DOM manipulations /.
export function DnD({ linkCollection, setReorderedLinkCollection }) {
  announce("this is the linkCollection", linkCollection)

  // abstraction of linkCollection - perhaps obsolete
  const [linkNodes, setLinkNodes] = useState(
    linkCollection.map((linkNode) => {
      linkNode.id = linkNode.position + "th-link"
      return linkNode
    })
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // up-drill every time reorder happens
  useEffect(() => {
    setReorderedLinkCollection(linkNodes)
  }, [linkNodes])

  const uniqueId = useId()

  let counter = 0

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      id={uniqueId}
    >
      <SortableContext items={linkNodes} strategy={verticalListSortingStrategy}>
        {linkNodes.map((linkNode) => {
          console.log("round #" + counter + " id is: " + linkNode.id)
          counter++

          return (
            <SortableLinkNode
              key={linkNode.position}
              id={linkNode.id}
              text={linkNode.text}
              url={linkNode.url}
            />
          )
        })}
      </SortableContext>
    </DndContext>
  )

  function handleDragEnd(event) {
    announce("handleDragEnd", event)
    announce("known Links:", linkCollection)

    const { active, over } = event

    console.log(`%c active.id => ${active.id}`, `color: green;`)
    console.log(`%c over.id => ${over.id}`, `color: green;`)

    if (active.id !== over.id) {
      setLinkNodes((items) => {
        const oldIndex = items.map((linkNode) => linkNode.id).indexOf(active.id)

        const newIndex = items.map((linkNode) => linkNode.id).indexOf(over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }
}
// V-DOM manipulations ./

// Mixed V-DOM & data manipulations /.
function sendLinkInputToUpdate(linkPosition) {
  let bufferText = document.getElementById(
    "linkTextInput-" + linkPosition
  ).value
  console.log("bufferText= " + bufferText)

  let bufferUrl = document.getElementById("linkUrlInput-" + linkPosition).value
  console.log("bufferURL= " + bufferUrl)

  updateLinkCollectionEntry(bufferText, bufferUrl, linkPosition)
}

function updateFullLinkCollection(
  reorderedLinkCollection,
  setLinkCollectionIsSortable
) {
  reorderedLinkCollection.forEach((linkNode, index) => {
    console.log(
      `%c changing linkNode.position from ${linkNode.position} => ${index}`,
      `color: green;`
    )
    // important: make sure 'position' matches the order desired by the user, thus:
    linkNode.position = index

    // commit to database
    handleDataUpdate(linkNode.text, linkNode.url, linkNode.position)
  })

  announce("reordered LinkCollection: ", reorderedLinkCollection)

  // reset the GUI to default
  setLinkCollectionIsSortable(false)
}

function cancelLinkCollectionUpdate(setLinkCollectionIsSortable) {
  // reset the GUI to default
  setLinkCollectionIsSortable(false)
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
