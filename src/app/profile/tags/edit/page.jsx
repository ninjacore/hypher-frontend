"use client"
import React, { use, useEffect, useState } from "react"

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

export default function Page() {
  return (
    <div>
      <TagEditor />
    </div>
  )
}

export function TagEditor({ children }) {
  const [knownTagsAsString, setKnownTagsAsString] = useState("")
  const [tagsLoadedFromSource, setTagsLoadedFromSource] = useState(false)

  // TOOD: verify/falsify -> perhaps will be omitted due to TagNodes being available
  const [knownTags, setKnownTags] = useState([])
  const [htmlWithTags, setHtmlWithTags] = useState("")

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
      // for testing
      announce("string of tags got some values", knownTagsAsString)

      let tagNodesListed = turnTagsIntoTagNodes(knownTagsAsString)
      setKnownTags(tagNodesListed)
      setTagsLoadedFromSource(true)
    } else {
      announce("string of tags is empty", knownTagsAsString)
    }
  }, [tagsLoadedFromSource])

  // render tags
  useEffect(() => {
    // for testing
    if (knownTags.length > 0) {
      announce("populated tag nodes", knownTags)
      let html = renderTags(knownTags)
      setHtmlWithTags(html)
    } else {
      announce("knownTags is empty", knownTags)
    }

    // do something with those known tags like rendering the innerHTML
    // const htmlWithTags = renderTags(knownTags)
  }, [knownTags])

  // default while waiting for data
  if (!tagsLoadedFromSource) {
    return (
      <>
        <h2>Your Favorite Tags</h2>
        <div>Loading...</div>
      </>
    )
  }

  // render page with tags
  return (
    <>
      <h2>Your Favorite Tags</h2>
      <div>{htmlWithTags}</div>
    </>
  )

  function loadTagsFromAPI() {
    // get user tag by serving endpoint and having it as a query parameter
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

  // TODO: write function (this is just a draft)
  // - check parameters and return
  function renderFullInnerPage(setHtmlWithTags, htmlProgressBar, htmlButtons) {
    return (
      <div className="mx-1">
        <>{htmlProgressBar}</>
        <h2 className="mb-2">
          <strong>Your Tags</strong>
          <div>{htmlWithTags}</div>
          <div className="mt-5 flex justify-end">
            <div className="w-2/4 mt-2 mr-6 flex justify-end gap-5">
              <>{htmlButtons}</>
            </div>
          </div>
        </h2>
      </div>
    )
  }

  function renderTags(knownTagsList) {
    if (knownTagsList.length > 0) {
      const renderedHTML = knownTagsList.map((tagNode) => {
        if (tagNode.isVisible === true) {
          return (
            <div
              key={tagNode.id}
              id={tagNode.id + "-div"}
              data-tag-id={tagNode.id}
              className="deletableTag inline-flex mx-1.5 my-1 px-3 py-0.45 rounded text-sm font-medium bg-white text-black"
              onClick={(e) => popTag(e, tagNode, knownTagsList)}
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

  // TODO: write function (this is just a draft)
  function renderProgressBar(knownTags) {
    progress = (knownTags.length / 50) * 100

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

  // TODO: write function (this is just a draft)
  function renderButtons() {
    return (
      <>
        <Button
          id="saveTagDeletionButton"
          variant="outline"
          className="bg-white text-black invisible"
          onClick={(e) => {
            deleteTagsFromServer(displayedTags)
          }}
        >
          SAVE CHANGES
        </Button>
        <Button
          id="reorderTagsButton"
          variant="outline"
          className="bg-white text-black"
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
                Tags will help you find other people with similar interests.
                Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="featuredTitle" className="text-right">
                  Title
                </Label>
                <Input
                  id="tagsInput"
                  type="text"
                  className="col-span-3"
                  onChange={(e) => setNewTagsBuffer(e.target.value)}
                  //value={tagText}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose>
                <Button
                  type="submit"
                  onClick={(e) => {
                    updateTagText(newTagsBuffer, knownTagsAsString)
                  }}
                >
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  function popTag(event, tagNode) {
    let tagNodeId = event.target.getAttribute("data-tag-id")

    announce("user popped tag with id =>", tagNodeId)

    hideTag(tagNode)
    markTagForDeletion(tagNode)
    // TODO: show 'save' and 'cancel' buttons
    saveTagState() // TODO: only do this if user clicks 'save'
  }

  function hideTag(tagNode) {
    tagNode.isVisible = false
    document.getElementById(tagNode.id + "-div").style.display = "none"
  }

  function markTagForDeletion(tagNode) {
    tagNode.isMarkedForDeletion = true
  }

  function saveTagState() {
    console.table(knownTags)

    let tagsToKeep = []
    let numberOfTags = 0
    // go through all tags and remove if marked for deletion
    knownTags.forEach((tagNode) => {
      if (tagNode.isMarkedForDeletion === false) {
        // is clear
        tagNode.position = numberOfTags
        tagsToKeep.push(tagNode)
        numberOfTags++
      }
    })
    setKnownTags(tagsToKeep)

    console.table(knownTags)

    // TODO: commit change to the database
  }
}

// for testing
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
