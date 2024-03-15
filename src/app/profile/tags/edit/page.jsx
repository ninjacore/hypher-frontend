"use client"
import React, { useId, useEffect, useState } from "react"

import { TagNode } from "@/app/profile/tags/components/TagNode/TagNode"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
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

import { SortableItem } from "./components/SortableItem/SortableItem"
// imports for sorting functionality ./

export default function Page() {
  return (
    <div>
      <TagEditor />
    </div>
  )
}

export function TagEditor() {
  // state variables
  const [knownTagsAsString, setKnownTagsAsString] = useState("")
  const [tagsLoadedFromSource, setTagsLoadedFromSource] = useState(false)
  const [knownTags, setKnownTags] = useState([])

  const [tagsAreSortable, setTagsAreSortable] = useState(false)

  // Effect hooks /.

  // load tags from API
  useEffect(() => {
    loadTagsFromAPI().then((tags) => {
      setKnownTagsAsString(tags)
      setTagsLoadedFromSource(true)
    })
  }, [])

  // turn tags into TagNodes
  useEffect(() => {
    if (tagsLoadedFromSource && knownTagsAsString.length > 0) {
      announce("string of tags got some values", knownTagsAsString)

      let tagNodesListed = turnTagsIntoTagNodes(knownTagsAsString)
      setKnownTags(tagNodesListed)
      setTagsLoadedFromSource(true)
    } else {
      announce("string of tags is empty", knownTagsAsString)
    }
  }, [tagsLoadedFromSource])

  // for debugging
  useEffect(() => {
    if (knownTags.length > 0) {
      // for testing
      announce("populated tag nodes", knownTags)
    } else {
      announce("knownTags is empty", knownTags)
    }
  }, [knownTags])
  // Effect hooks ./

  // 'reorder tags' mode
  if (tagsAreSortable) {
    return (
      <div className="mx-1">
        <ProgressBarComponent knownTags={knownTags} />
        <h2 className="mb-2">
          <strong>Your Tag Order</strong>
        </h2>
        <p>Pick up a tag to change its position in the order.</p>

        <SortableTags knownTags={knownTags} />
        <div className="mt-5 flex justify-end">
          <div className="w-2/4 mt-2 mr-6 flex justify-end gap-5">
            <TagsSortModeButons setTagsAreSortable={setTagsAreSortable} />
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="mx-1">
        <ProgressBarComponent knownTags={knownTags} />
        <h2 className="mb-2">
          <strong>Your Tags</strong>
        </h2>

        <div>
          <TagsComponent knownTagsList={knownTags} />
        </div>
        <div className="mt-5 flex justify-end">
          <div className="w-2/4 mt-2 mr-6 flex justify-end gap-5">
            {/* passing an event handler down as a prop */}
            <TagEditModeButtons
              onAddTagClick={() => addTag(knownTags, setKnownTags)}
              knownTags={knownTags}
              setKnownTags={setKnownTags}
              setTagsAreSortable={setTagsAreSortable}
            />
          </div>
        </div>
      </div>
    )
  }
}

export function ProgressBarComponent({ knownTags }) {
  let progress = (knownTags.length / 50) * 100

  return (
    <>
      <span>Using {knownTags.length} tags out of 50</span>
      <Progress
        id="tagsProgressBar"
        value={progress}
        className="w-[60%] my-4"
      />
    </>
  )
}

export function TagsComponent({ knownTagsList }) {
  announce("rendering tags", knownTagsList)

  if (knownTagsList.length > 0) {
    const renderedHTML = knownTagsList.map((tagNode) => {
      if (tagNode.isVisible === true) {
        return (
          <div
            key={tagNode.id}
            id={tagNode.id + "-div"}
            data-tag-id={tagNode.id}
            className="deletableTag inline-flex mx-1.5 my-1 px-3 py-0.45 rounded text-sm font-medium bg-white text-black"
            onClick={(e) => popVisbileTag(e, tagNode, knownTagsList)}
          >
            <span id={tagNode.id + "-span"} data-tag-id={tagNode.id}>
              {tagNode.text}
              <FontAwesomeIcon
                id={tagNode.id + "-icon"}
                data-tag-id={tagNode.id}
                icon={faXmark}
                className="fas fa-angle-right text-xs my-auto my-2.45 ml-1 py-0.45"
              ></FontAwesomeIcon>
            </span>
          </div>
        )
      }
    })

    return <>{renderedHTML}</>
  } else {
    return (
      <div>
        <p>no tags to render</p>
      </div>
    )
  }
}

export function TagEditModeButtons({
  onAddTagClick,
  knownTags,
  setKnownTags,
  setTagsAreSortable,
}) {
  return (
    <>
      <Button
        id="saveTagStateButton"
        variant="outline"
        className="bg-white text-black invisible"
        onClick={() => {
          commitTagDeletion(knownTags, setKnownTags)
        }}
      >
        SAVE CHANGES
      </Button>
      <Button
        id="cancelStateUpdateButton"
        variant="outline"
        className="bg-white text-black invisible"
        onClick={() => {
          cancelStateUpdate(knownTags, setKnownTags)
        }}
      >
        CANCEL
      </Button>
      <Button
        id="reorderTagsButton"
        variant="outline"
        className="bg-white text-black"
        onClick={() => {
          setTagsAreSortable(true)
        }}
      >
        REORDER
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <div className="group/edit">
            <Button
              id="addTagsButton"
              variant="outline"
              className="bg-white text-black"
            >
              ADD
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
            <DialogDescription>
              Tags will help you find other people with similar interests. Click
              save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="featuredTitle" className="text-right">
                Title
              </Label>
              <Input id="tagsInput" type="text" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button type="submit" onClick={onAddTagClick}>
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function SortableTags({ knownTags }) {
  announce("rendering sortable tags", knownTags)
  return (
    <>
      {/* <h2 className="text-xl font-bold mx-1 mt-2 mb-4">Sort Your Tags</h2> */}
      <DnD knownTags={knownTags} />
    </>
  )
}

export function DnD({ knownTags }) {
  // const [items, setItems] = useState([1, 2, 3, 4])

  // TODO: fully understand this mapping, maybe change it
  const [items, setItems] = useState(knownTags.map((tagNode) => tagNode.text))
  // const [items, setItems] = useState(knownTags.map((tagNode) => tagNode.text))

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const uniqueId = useId()

  let counter = 0

  // TODO: better variable(-names)
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      id={uniqueId}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((tagNode) => {
          console.log("round #" + counter + " id is: " + tagNode)
          counter++

          return <SortableItem key={tagNode} id={tagNode} text={tagNode} />
        })}
      </SortableContext>
    </DndContext>
  )

  // TODO: do something with the knownTags array here
  function handleDragEnd(event) {
    const { active, over } = event

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }
}

export function TagsSortModeButons({ knownTagsList, setTagsAreSortable }) {
  return (
    <>
      <Button
        id="cancelReorderButton"
        variant="outline"
        className="bg-white text-black"
        onClick={() => {
          setTagsAreSortable(false)
        }}
      >
        CANCEL
      </Button>

      <Button
        id="saveReorderedTagsButton"
        variant="outline"
        className="bg-white text-black"
      >
        SAVE
      </Button>
    </>
  )
}

// V-DOM manipulations /.
function addTag(knownTags, setKnownTags) {
  let bufferText = document.getElementById("tagsInput").value

  // for debugginc
  announce("user is saving tag with text [getById]: ", bufferText)

  // only save tag if there's actual text in the buffer
  let textWithoutSpaces = bufferText.replace(/\s/g, "")
  if (textWithoutSpaces.length > 0) {
    let listOfKnownTags = knownTags

    let tagNode = new TagNode(bufferText)
    tagNode.position = listOfKnownTags.length
    let tailingTag = listOfKnownTags[listOfKnownTags.length - 1]
    tailingTag.insertAfter(tagNode)

    // save new list of known tags
    listOfKnownTags.push(tagNode)
    setKnownTags(listOfKnownTags)

    // save tag state to the database
    saveVisibleTags(knownTags, setKnownTags)
  }
}

function showTag(tagNode) {
  tagNode.isVisible = true
  document.getElementById(tagNode.id + "-div").style.display = "inline-flex"
}

function hideTag(tagNode) {
  tagNode.isVisible = false
  document.getElementById(tagNode.id + "-div").style.display = "none"
}

function showSaveTageStateButton() {
  document.getElementById("saveTagStateButton").classList.remove("invisible")
}

function hideSaveTagStateButton() {
  document.getElementById("saveTagStateButton").classList.add("invisible")
}

function showCancelButton() {
  document
    .getElementById("cancelStateUpdateButton")
    .classList.remove("invisible")
}

function hideCancelButton() {
  document.getElementById("cancelStateUpdateButton").classList.add("invisible")
}

function showReorderButton() {
  document.getElementById("reorderTagsButton").classList.remove("invisible")
}

function hideReorderButton() {
  document.getElementById("reorderTagsButton").classList.add("invisible")
}

function showAddTagButton() {
  document.getElementById("addTagsButton").classList.remove("invisible")
}

function hideAddTagButton() {
  document.getElementById("addTagsButton").classList.add("invisible")
}

// V-DOM manipulations ./

// Data functions /.
function loadTagsFromAPI() {
  // TODO: get user tag by serving endpoint and having it as a query parameter
  let handle = "dnt.is"

  const apiUrl = `http://localhost:5678/api/v1/profiles/${handle}/tags`

  // get all the tags for this user
  return fetch(apiUrl).then((response) =>
    response
      .json()
      .then((data) => ({
        data: data,
        status: response.status,
      }))
      .then((res) => {
        console.log("decodedResponse=", res)
        // only load if there's data
        if (res.data) {
          // for testing
          announce("got tags from API", res.data)

          return res.data
        }
      })
  )
}

function saveTagsToAPI(newTagsAsString) {
  // TODO: get user tag by serving endpoint and having it as a query parameter
  let handle = "dnt.is"

  const apiUrl = `http://localhost:5678/api/v1/profiles/${handle}/tags`

  fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      JSON.parse(
        JSON.stringify({
          tags: newTagsAsString,
        })
      )
    ),
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

function turnTagsIntoTagNodes(tags) {
  // split tags into array
  let tagsArray = tags.split(", ")
  let tagPosition = 0

  // create TagNodes
  let tagNodes = []
  tagsArray.forEach((tag) => {
    // create TagNode
    let tagNode = new TagNode(tag)
    tagNode.position = tagPosition

    // connect nodes
    if (tagNodes.length > 0) {
      tagNodes[tagNodes.length - 1].insertAfter(tagNode)
    }

    // add to tracking list
    tagNodes.push(tagNode)
    tagPosition++
  })

  return tagNodes
}
// Data functions ./

// Mixed V-DOM & data manipulations /.
function popVisbileTag(event, tagNode) {
  let tagNodeId = event.target.getAttribute("data-tag-id")

  announce("user popped tag with id =>", tagNodeId)

  hideTag(tagNode)
  markTagForDeletion(tagNode)

  // TODO: show 'save' and 'cancel' buttons
  showSaveTageStateButton()
  showCancelButton()
  hideReorderButton()
  hideAddTagButton()
}

function markTagForDeletion(tagNode) {
  tagNode.isMarkedForDeletion = true
}

// commits the tags to the databse if they are visible to the user
function saveVisibleTags(knownTags, setKnownTags) {
  console.table(knownTags)

  let tagsToKeep = []
  let numberOfTags = 0
  let tagsToKeepAsString = ""

  // go through all tags and remove if marked for deletion
  knownTags.forEach((tagNode) => {
    if (tagNode.isMarkedForDeletion === false) {
      // is clear

      if (numberOfTags > 0) {
        tagsToKeepAsString += ", "
        tagsToKeepAsString += tagNode.text
      } else {
        // first one
        tagsToKeepAsString += tagNode.text
      }

      tagNode.position = numberOfTags
      tagsToKeep.push(tagNode)
      numberOfTags++
    }
  })

  console.table(tagsToKeep)

  // commit change to the database
  saveTagsToAPI(tagsToKeepAsString)

  setKnownTags(tagsToKeep)
}

function commitTagDeletion(knownTags, setKnownTags) {
  saveVisibleTags(knownTags, setKnownTags)

  // reset view to default
  hideSaveTagStateButton()
  hideCancelButton()
  showReorderButton()
  showAddTagButton()
}

function cancelStateUpdate(knownTags, setKnownTags) {
  let allTagsToKeep = []
  let numberOfTags = 0

  // reset status attributes of tagNodes
  knownTags.forEach((tagNode) => {
    tagNode.isMarkedForDeletion = false
    tagNode.isVisible = true
    tagNode.position = numberOfTags
    allTagsToKeep.push(tagNode)
    numberOfTags++

    // DOM manipulation
    showTag(tagNode)
  })

  // hide 'save' and 'cancel' buttons
  hideSaveTagStateButton()
  hideCancelButton()
  showReorderButton()
  showAddTagButton()

  announce("keeping all tags: ", allTagsToKeep)
  console.table(allTagsToKeep)

  setKnownTags(allTagsToKeep)
}
// Mixed V-DOM & data manipulations ./

// Support functions (debug) /.
function announce(announcement, objectToLog) {
  let colorCode = ""

  switch (announcement) {
    case "got tags from API":
      colorCode = "#7fffd4" // green
      break

    case "populated tag nodes":
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
      colorCode = "#eee600" // titanium yellow
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
