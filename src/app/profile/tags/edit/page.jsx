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
      <BetterTagEditor />
    </div>
  )
}

// TODO: make main component
export function BetterTagEditor() {
  const [knownTagsAsString, setKnownTagsAsString] = useState("")
  const [tagsLoadedFromSource, setTagsLoadedFromSource] = useState(false)

  const [knownTags, setKnownTags] = useState([])
  const [tagBuffer, setTagBuffer] = useState("")
  let tagToSaveText = ""

  return (
    <div className="mx-1">
      <ProgressBarComponent knownTags={knownTags} />
      <h2 className="mb-2">
        <strong>Your Tags</strong>
        <div>
          <TagsComponent knownTagsList={knownTags} />
        </div>
        <div className="mt-5 flex justify-end">
          <div className="w-2/4 mt-2 mr-6 flex justify-end gap-5">
            {/* passing an event handler down as a prop */}
            <ButtonsComponent onAddTagClick={() => addTag(knownTags)} />
          </div>
        </div>
      </h2>
    </div>
  )
}

export function ProgressBarComponent(knownTags) {
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

export function TagsComponent(knownTagsList) {
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

export function ButtonsComponent({ onAddTagClick }) {
  return (
    <>
      <Button
        id="saveTagStateButton"
        variant="outline"
        className="bg-white text-black invisible"
        onClick={() => {
          saveVisibleTags()
        }}
      >
        SAVE CHANGES
      </Button>
      <Button
        id="cancelStateUpdateButton"
        variant="outline"
        className="bg-white text-black invisible"
        onClick={() => {
          cancelStateUpdate()
        }}
      >
        CANCEL
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
              Tags will help you find other people with similar interests. Click
              save when you're done.
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
                // onChange={(e) => setTagBuffer(e.target.value)}
                onChange={(e) => {
                  tagToSaveText = e.target.value
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button
                type="submit"
                // onClick={(e) => {
                //   addTag(tagToSaveText)
                // }}
                onClick={onAddTagClick}
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

function addTag(knownTags) {
  let bufferText = document.getElementById("tagsInput").value

  announce("user is saving tag with text [getById]: ", bufferText)
  // announce("user is saving tag with text [state variable]: ", tagBuffer)
  // announce("knownTags are [parameter]: ", tagArray)
  // announce("knownTags are [state variable]: ", knownTags)

  // announce("tag text [function-scope variable]: ", tagToSaveText)

  // console.log("tag buffer: " + tagBuffer)

  let listOfKnownTags = knownTags

  let tagNode = new TagNode(bufferText)
  tagNode.position = listOfKnownTags.length
  let tailingTag = listOfKnownTags[listOfKnownTags.length - 1]
  tailingTag.insertAfter(tagNode)

  // save new list of known tags
  listOfKnownTags.push(tagNode)
  setKnownTags(listOfKnownTags)

  // re-render as needed
  setHtmlWithTags(renderTags(knownTags))
  setHtmlProgressBar(renderProgressBar(knownTags))

  // save tag state to the database
  saveVisibleTags()
}

/////////////////////////////////////////////////
/** 2nd but old approach below
 *  // TODO: delete after refactoring
 */
/////////////////////////////////////////////////

export function TagEditor({ children }) {
  const [knownTagsAsString, setKnownTagsAsString] = useState("")
  const [tagsLoadedFromSource, setTagsLoadedFromSource] = useState(false)

  // TOOD: verify/falsify -> perhaps will be omitted due to TagNodes being available
  const [knownTags, setKnownTags] = useState([])
  const [tagBuffer, setTagBuffer] = useState("")
  let tagToSaveText = ""

  // const onChangeHandler = (event) => {
  //   announce("value for buffer: ", event.target.value)
  //   announce("value of variable 'newTagBuffer': ", tagBuffer)

  //   setTagBuffer(event.target.value)
  //   setTagBuffer("lol")
  // }

  // html variables to be used for rendering
  const [htmlWithTags, setHtmlWithTags] = useState("")
  const [htmlProgressBar, setHtmlProgressBar] = useState("")
  const [htmlButtons, setHtmlButtons] = useState("")
  const [htmlFullInnerPage, setHtmlFullInnerPage] = useState("")

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

  // render html components with data
  useEffect(() => {
    if (knownTags.length > 0) {
      // for testing
      announce("populated tag nodes", knownTags)

      // renderButtons()
      setHtmlWithTags(renderTags(knownTags))
      setHtmlProgressBar(renderProgressBar(knownTags))
      setHtmlButtons(renderButtons())

      // TODO: check if obsolete
      setHtmlFullInnerPage(
        renderFullInnerPage(htmlWithTags, htmlProgressBar, htmlButtons)
      )

      // renderFullInnerPage(htmlWithTags, htmlProgressBar, htmlButtons)
    } else {
      announce("knownTags is empty", knownTags)
    }

    // do something with those known tags like rendering the innerHTML
    // const htmlWithTags = renderTags(knownTags)
  }, [knownTags])

  // on user interactions
  useEffect(() => {
    // TODO: check if progress bar updates, otherwise:
    //       setHtmlProgressBar(renderProgressBar(knownTags))

    setHtmlFullInnerPage(
      renderFullInnerPage(htmlWithTags, htmlProgressBar, htmlButtons)
    )
  }, [htmlWithTags, htmlProgressBar, htmlButtons])

  // // temporary for debugging
  // useEffect(() => {
  //   announce("knownTags after 'setKnownTags(listOfKnownTags)': ", knownTags)
  // }, [knownTags])

  // // temporary for debugging
  // useEffect(() => {
  //   announce("tagBuffer after 'setTagBuffer(tagBufferData)': ", tagBuffer)
  //   tagToSaveText = tagBuffer
  //   announce("saving tag with text: ", tagToSaveText)
  // }, [tagBuffer])

  // default while waiting for data
  if (!tagsLoadedFromSource) {
    return (
      <>
        <h2>Your Favorite Tags</h2>
        <div>Loading...</div>
      </>
    )
  }

  // TODO: render full inner page instead
  // render page with tags
  return (
    <>
      <h2>Your Favorite Tags</h2>
      <div>{htmlFullInnerPage}</div>
    </>
  )

  /** data functions **/
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

  /** rendering functions **/

  // TODO: write function (this is just a draft)
  // - check parameters and return
  function renderFullInnerPage() {
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

  function renderProgressBar(knownTags) {
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

  // TODO: write function (this is just a draft)
  function renderButtons() {
    return (
      <>
        <Button
          id="saveTagStateButton"
          variant="outline"
          className="bg-white text-black invisible"
          onClick={() => {
            setKnownTags(saveVisibleTags())
          }}
        >
          SAVE CHANGES
        </Button>
        <Button
          id="cancelStateUpdateButton"
          variant="outline"
          className="bg-white text-black invisible"
          onClick={() => {
            setHtmlWithTags(renderTags(cancelStateUpdate()))
          }}
        >
          CANCEL
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
                  // onChange={(e) => setTagBuffer(e.target.value)}
                  onChange={(e) => {
                    tagToSaveText = e.target.value
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose>
                <Button
                  type="submit"
                  onClick={(e) => {
                    addTag(tagToSaveText)
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

  /** mixed functions (data + rendering) **/
  function addTag(bufferText) {
    announce("user is saving tag with text [parameter]: ", bufferText)
    // announce("user is saving tag with text [state variable]: ", tagBuffer)
    // announce("knownTags are [parameter]: ", tagArray)
    // announce("knownTags are [state variable]: ", knownTags)

    announce("tag text [function-scope variable]: ", tagToSaveText)

    // console.log("tag buffer: " + tagBuffer)

    let listOfKnownTags = knownTags

    let tagNode = new TagNode(bufferText)
    tagNode.position = listOfKnownTags.length
    let tailingTag = listOfKnownTags[listOfKnownTags.length - 1]
    tailingTag.insertAfter(tagNode)

    // save new list of known tags
    listOfKnownTags.push(tagNode)
    setKnownTags(listOfKnownTags)

    // re-render as needed
    setHtmlWithTags(renderTags(knownTags))
    setHtmlProgressBar(renderProgressBar(knownTags))

    // save tag state to the database
    saveVisibleTags()
  }

  function popVisbileTag(event, tagNode) {
    let tagNodeId = event.target.getAttribute("data-tag-id")

    announce("user popped tag with id =>", tagNodeId)

    hideTag(tagNode)
    markTagForDeletion(tagNode)

    // TODO: show 'save' and 'cancel' buttons
    showSaveButton()
    showCancelButton()
    hideReorderButton()
    hideAddTagButton()
  }

  function hideTag(tagNode) {
    tagNode.isVisible = false
    document.getElementById(tagNode.id + "-div").style.display = "none"
  }

  function showSaveButton() {
    document.getElementById("saveTagStateButton").classList.remove("invisible")
  }

  function hideSaveButton() {
    document.getElementById("saveTagStateButton").classList.add("invisible")
  }

  function showCancelButton() {
    document
      .getElementById("cancelStateUpdateButton")
      .classList.remove("invisible")
  }

  function hideCancelButton() {
    document
      .getElementById("cancelStateUpdateButton")
      .classList.add("invisible")
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

  function markTagForDeletion(tagNode) {
    tagNode.isMarkedForDeletion = true
  }

  // TODO: rewrite so it only saves what is and doesn't update FE (including dependencies)
  // commits the tags to the databse if they are visible to the user
  function saveVisibleTags() {
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

    // TODO: commit change to the database
    console.table(tagsToKeep)
    return tagsToKeep
  }

  function cancelStateUpdate() {
    let allTagsToKeep = []
    let numberOfTags = 0

    // reset status attributes of tagNodes
    knownTags.forEach((tagNode) => {
      tagNode.isMarkedForDeletion = false
      tagNode.isVisible = true
      tagNode.position = numberOfTags

      allTagsToKeep.push(tagNode)
      numberOfTags++
    })

    // render knownTags as they were before the user started editing
    // renderTags(knownTags)
    // setHtmlWithTags(renderTags(allTagsToKeep))

    // hide 'save' and 'cancel' buttons
    hideSaveButton()
    hideCancelButton()
    showReorderButton()
    showAddTagButton()

    return allTagsToKeep
  }
}

/** support functions (debug) **/
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
