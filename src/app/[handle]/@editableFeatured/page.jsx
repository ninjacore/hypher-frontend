"use client"

import { useId, useContext, useState, useEffect, use } from "react"
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
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

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

import { SortableFeaturedContentNode } from "./SortableFeaturedContentNode/SortableFeaturedContentNode"
// imports for sorting functionality ./

export default function Page() {
  return (
    <Profile>
      <EditableFeaturedContentWithContext />
    </Profile>
  )
}

function EditableFeaturedContentWithContext() {
  const profile = useContext(ProfileContext)
  // Check if profile or mainProfileData is not yet defined and return null or a loading state
  if (!profile || !profile.mainProfileData) {
    // You can return a loading spinner, a placeholder, or null to avoid rendering this component prematurely
    return <div>Loading...</div> // or return null;
  }

  // load the data from context
  const { featuredContentData } = profile
  // sort by position to display it correctly
  let featuredContentByPosition = featuredContentData.contentBox.toSorted(
    (a, b) => a.position - b.position
  )

  console.log("featuredContent.contentBox=")
  console.table(featuredContentData.contentBox)
  console.log("featuredContent")
  console.log(featuredContentData)

  // new state variables
  const [featuredContentIsSortable, setFeaturedContentIsSortable] =
    useState(false)
  const [featuredContentEntries, setFeaturedContentEntries] = useState(
    featuredContentByPosition.map((featuredContent) => featuredContent)
  )
  announce("populated featured content list", featuredContentEntries)

  let title = featuredContentData.shortTitle

  if (featuredContentIsSortable) {
    return (
      <>
        <b>{title}</b>
        <p>Pick up an entry to change its position in the collection.</p>

        <InEditableFeaturedContent
          featuredContentEntries={featuredContentEntries}
          setFeaturedContentIsSortable={setFeaturedContentIsSortable}
        />
      </>
    )
  } else {
    return (
      <>
        <b>{title}</b>

        <EditableFeaturedContent
          featuredContentEntries={featuredContentEntries}
        />
        <div className="flex justify-end">
          <Button
            id="activateReorderFeaturedContentButton"
            variant="outline"
            className="bg-white text-black"
            onClick={() => setFeaturedContentIsSortable(true)}
          >
            change order
          </Button>
        </div>
      </>
    )
  }
}

function InEditableFeaturedContent({
  featuredContentEntries,
  setFeaturedContentIsSortable,
}) {
  const [reorderedFeaturedContentEntries, setReorderedFeaturedContentEntries] =
    useState(featuredContentEntries)

  return (
    <>
      <DnD
        featuredContentEntries={featuredContentEntries}
        setReorderedFeaturedContentEntries={setReorderedFeaturedContentEntries}
      />
      <div className="flex justify-end gap-5">
        <div>
          <Button
            id="cancelReorderFeaturedContentButton"
            variant="outline"
            className="bg-white text-black"
            onClick={() => {
              cancelFeaturedContentUpdate(setFeaturedContentIsSortable)
            }}
          >
            cancel
          </Button>
        </div>
        <div>
          <Button
            id="saveReorderFeaturedContentButton"
            variant="outline"
            className="bg-white text-black"
            onClick={() => {
              sendFullFeaturedContentToUpdate(
                reorderedFeaturedContentEntries,
                setFeaturedContentIsSortable
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

function EditableFeaturedContent({ featuredContentEntries }) {
  return featuredContentEntries.map((featuredContent) => {
    // pre-load from context if available
    let defaultFeaturedTitle = ""
    let defaultFeaturedLink = ""
    let defaultFeaturedDescription = ""

    if (featuredContent.title.length > 0) {
      defaultFeaturedTitle = featuredContent.title
    }
    if (featuredContent.url.length > 0) {
      defaultFeaturedLink = featuredContent.url
    }
    if (featuredContent.description.length > 0) {
      defaultFeaturedDescription = featuredContent.description
    }

    // for the input fields
    const [featuredTitle, setFeaturedTitle] = useState(defaultFeaturedTitle)
    const [featuredLink, setFeaturedLink] = useState(defaultFeaturedLink)
    const [featuredDescription, setFeaturedDescription] = useState(
      defaultFeaturedDescription
    )

    return (
      <Card
        key={featuredContent.category + featuredContent.position}
        className="my-4"
      >
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex group/edit">
              <div className="text-5xl py-4 px-2">
                <IconMapper url={featuredContent.category + ":"} />
              </div>
              <div className="grow p-2">
                <span id={"featuredTitle-" + featuredContent.position}>
                  {defaultFeaturedTitle}
                </span>
                <EditButton />
                <br />
                <span id={"featuredDescription-" + featuredContent.position}>
                  {featuredContent.description.length > 0
                    ? featuredContent.description
                    : featuredContent.url}
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
                  id={"featuredTitleInput-" + featuredContent.position}
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
                  id={"featuredLinkInput-" + featuredContent.position}
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
                  id={"featuredDescriptionInput-" + featuredContent.position}
                  type="text"
                  className="col-span-3"
                  onChange={(e) => setFeaturedDescription(e.target.value)}
                  value={featuredDescription}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose>
                <Button
                  type="submit"
                  onClick={() =>
                    sendFeaturedContentToUpdate(featuredContent.position)
                  }
                >
                  Save changes
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    )
  })
}

// Network interactions /.
function handleDataUpdate(
  featuredTitle,
  featuredLink,
  featuredDescription,
  contentBoxPosition
) {
  // get handle from url of this page
  const url = window.location.href
  const handle = url.split("/").pop()
  console.log("handle=")
  console.log(handle)

  const apiURL = `http://localhost:5678/api/v1/featuredContents/${handle}/update?position=${contentBoxPosition}`

  fetch(apiURL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: featuredTitle,
      url: featuredLink,
      description: featuredDescription,
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

// V-DOM Manipulations /.
function DnD({ featuredContentEntries, setReorderedFeaturedContentEntries }) {
  announce("this is the featuredContentEntries", featuredContentEntries, "blue")

  // preparing entries for drag and drop
  const [featuredContentNodes, setFeaturedContentNodes] = useState(
    featuredContentEntries.map((featuredContentNode) => {
      featuredContentNode.id = featuredContentNode.position + "th-content"
      return featuredContentNode
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
    setReorderedFeaturedContentEntries(featuredContentNodes)
  }, [featuredContentNodes])

  const uniqueId = useId()

  let counter = 0

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      id={uniqueId}
    >
      <SortableContext
        items={featuredContentNodes}
        strategy={verticalListSortingStrategy}
      >
        {featuredContentNodes.map((contentNode) => {
          console.log("round #" + counter + " id is: " + contentNode.id)
          counter++

          return (
            <SortableFeaturedContentNode
              key={contentNode.position}
              id={contentNode.id}
              title={contentNode.title}
              description={contentNode.description}
              url={contentNode.url}
              category={contentNode.category}
            />
          )
        })}
      </SortableContext>
    </DndContext>
  )

  function handleDragEnd(event) {
    announce("handleDragEnd", event)
    announce("known content:", featuredContentEntries)

    const { active, over } = event

    console.log(`%c active.id => ${active.id}`, `color: green;`)
    console.log(`%c over.id => ${over.id}`, `color: green;`)

    if (active.id !== over.id) {
      setFeaturedContentNodes((items) => {
        const oldIndex = items
          .map((contentNode) => contentNode.id)
          .indexOf(active.id)

        const newIndex = items
          .map((contentNode) => contentNode.id)
          .indexOf(over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }
}
// V-DOM Manipulations ./

// Mixed V-DOM & data manipulations /.
function sendFeaturedContentToUpdate(featuredContentPosition) {
  // featuredTitleInput
  let bufferTitle = document.getElementById(
    "featuredTitleInput-" + featuredContentPosition
  ).value
  console.log("bufferTitle=" + bufferTitle)

  // featuredLinkInput
  let bufferLink = document.getElementById(
    "featuredLinkInput-" + featuredContentPosition
  ).value
  console.log("bufferLink=" + bufferLink)

  // featuredDescriptionInput
  let bufferDescription = document.getElementById(
    "featuredDescriptionInput-" + featuredContentPosition
  ).value
  console.log("bufferDescription=" + bufferDescription)

  // commit change to database
  handleDataUpdate(
    bufferTitle,
    bufferLink,
    bufferDescription,
    featuredContentPosition
  )

  // show change in UI
  document.getElementById(
    "featuredTitle-" + featuredContentPosition
  ).innerHTML = bufferTitle
  let displayedDescription = document.getElementById(
    "featuredDescription-" + featuredContentPosition
  )
  if (bufferDescription.length > 0) {
    displayedDescription.innerHTML = bufferDescription
  } else {
    displayedDescription.innerHTML = bufferLink
  }
}

function cancelFeaturedContentUpdate(setFeaturedContentIsSortable) {
  // reset the GUI to default
  setFeaturedContentIsSortable(false)
}

function sendFullFeaturedContentToUpdate(
  reorderedFeaturedContentEntries,
  setFeaturedContentIsSortable
) {
  reorderedFeaturedContentEntries.forEach((featuredContent, index) => {
    console.log(
      `%c changing linkNode.position from ${featuredContent.position} => ${index}`,
      `color: green;`
    )
    // important: make sure 'position' matches the order desired by the user

    featuredContent.position = index

    // commit to database
    handleDataUpdate(
      featuredContent.title,
      featuredContent.url,
      featuredContent.description,
      featuredContent.position
    )
  })

  // keep new order without reload from backend
  // setFeaturedContentEntries(reorderedFeaturedContentEntries)

  // reset view
  setFeaturedContentIsSortable(false)
}
// Mixed V-DOM & data manipulations ./

// Support functions (debug) /.
function announce(announcement, objectToLog, colorName) {
  let colorCode = ""

  switch (colorName) {
    case "titanium yellow":
      colorCode = "#eee600" // titanium yellow
      break

    case "bisque":
      colorCode = "#ffe4c4" // bisque
      break

    case "lime":
      colorCode = "#00ff00" // lime
      break

    case "orchid":
      colorCode = "#da70d6" // orchid
      break

    case "cyan":
      colorCode = "#00ffff" // cyan
      break

    case "green":
      colorCode = "#7fffd4" // green
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
