"use client"
import React, { useEffect, useState } from "react"

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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

export default function Page() {
  return (
    <div>
      <TagEditor />
    </div>
  )
}

export function TagEditor({ children }) {
  const [tags, setTags] = useState(null)
  const [loaded, setLoaded] = useState(false)

  // to track PUT, DELETE requests to the API
  const [reload, setReload] = useState(false)

  // const [progress, setProgress] = useState(0)
  const [newTagsBuffer, setNewTagsBuffer] = useState(null)
  const [shownTags, setShownTags] = useState(null)

  // get user tag by serving endpoint and having it as a query parameter
  let handle = "dnt.is"

  const apiUrl = `http://localhost:5678/api/v1/profiles/${handle}/tags`

  // get all the tags for this user
  useEffect(() => {
    fetch(apiUrl).then((response) =>
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
            console.log(
              `%c /////////////////`,
              "color: #34D399; font-size: 20px;"
            )
            console.log(
              `%c function: [ useEffect: fetch data from API ]`,
              "color: #34D399;"
            )
            console.log(
              `%c res.data type => ${typeof res.data}`,
              "color: #34D399;"
            )
            console.log(`%c res.data => ${res.data}`, "color: #34D399;")

            console.log("res.data=")
            console.log(res.data)
            setTags(res.data)
            setLoaded(true)
          }
        })
    )
  }, [])

  // while waiting for data
  if (!loaded) {
    return (
      <>
        <h2>Your Favorite Tags</h2>
        <div>Loading...</div>
      </>
    )
  }

  // split tags
  let tagsArray = tags.split(",")

  // starting value for tag max display
  let tagCount = 0
  let progress = 0

  const innerHTML = tagsArray.map(
    (tag) => {
      // update tag count to show if maxing out
      tagCount++
      progress = (tagCount / 50) * 100

      return (
        <span key={"tag-" + tagCount}>
          <span
            id={"tag-" + tagCount}
            className="deletableTag inline-flex mx-1.5 my-1 px-3 py-0.45 rounded text-sm font-medium bg-white text-black"
            onClick={(e) => deleteTagFromUI(e.target, tag)}
          >
            {tag}
            {/* delete icon to indicate functionality */}
            <FontAwesomeIcon
              id={"deleteTagIcon-" + tagCount}
              icon={faXmark}
              className="fas fa-angle-right text-xs my-auto my-2.45 ml-1 py-0.45"
            ></FontAwesomeIcon>
          </span>
        </span>
      )
    },
    [reload]
  )

  return (
    <div className="mx-1">
      <span>Using {tagCount} tags out of 50</span>
      <Progress
        id="tagsProgressBar"
        value={progress}
        className="w-[60%] my-4"
      />

      <h2 className="mb-2">
        <strong>Your Tags</strong>
        <div>{innerHTML}</div>
        <div className="mt-5 flex justify-end">
          <div className="w-2/4 mt-2 mr-6 flex justify-end gap-5">
            <Button
              id="saveTagDeletionButton"
              variant="outline"
              className="bg-white text-black invisible"
              onClick={(e) => {
                deleteTagsFromServer(shownTags)
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
                        updateTagText(newTagsBuffer, tags)
                      }}
                    >
                      Save
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </h2>
    </div>
  )

  function updateTagText(newTagsBuffer, existingTags) {
    console.log(`%c /////////////////`, "color: #faf0be; font-size: 20px;")
    console.log(`%c function: [ updateTagText ]`, "color: #faf0be;")
    console.log(
      `%c newTagsBuffer type => ${typeof newTagsBuffer}`,
      "color: #faf0be;"
    )
    console.log(`%c newTagsBuffer => ${newTagsBuffer}`, "color: #faf0be;")
    console.log(
      `%c existingTags type => ${typeof existingTags}`,
      "color: #faf0be;"
    )
    console.log(`%c existingTags => ${existingTags}`, "color: #faf0be;")

    // combine new tags with existing tags
    let tagsToSave = ""
    tagsToSave += existingTags
    tagsToSave += ", " + newTagsBuffer
    // tagsToSave = tagsToSave.split(",")

    console.log("tagsToSave => " + tagsToSave)

    // save new tags to server
    updateTagsOnServer(tagsToSave)

    // // TODO: replace with dynamic handle
    // let handle = "dnt.is"

    // const apiURL = `http://localhost:5678/api/v1/profiles/${handle}/tags`

    // fetch(apiURL, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     tags: tagsToSave,
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("Success:", data)
    //     return data
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error)
    //     return error
    //   })

    // // re-render UI
    // // set tags to new ones
    // setTags(tagsToSave.toString())

    // // set reload to true
    // setReload(true)
  }

  function deleteTagFromUI(wasClicked, tag) {
    console.log(`%c /////////////////`, "color: cyan; font-size: 20px;")
    console.log(`%c function: [ deleteTagFromUI ]`, "color: cyan;")
    console.log(`%c wasClicked type => ${typeof wasClicked}`, "color: cyan;")
    console.log(`%c wasClicked => ${wasClicked}`, "color: cyan;")
    console.log(`%c tag type => ${typeof tag}`, "color: cyan;")
    console.log(`%c tag => ${tag}`, "color: cyan;")

    console.log("wasClicked => " + wasClicked)
    console.log("classes: " + wasClicked.classList)
    console.log("deleting tag => " + tag)

    // get all tags as array
    let tagsArray = tags.split(",")
    console.log("all tags atm => " + tagsArray)
    console.log("type of tagsArray => " + typeof tagsArray)
    console.log("as a table:")
    console.table(tagsArray)

    // used for re-rendering
    let idNumber = null

    // remove tag from array
    try {
      let index = tagsArray.indexOf(tag) // get index of tag
      if (index > -1) {
        // remove tag if it exists
        tagsArray.splice(index, 1)
        console.log("removed tag => " + tag)
        console.log("tagsArray after deletion => " + tagsArray)

        // id number of tag to delete
        idNumber = index + 1

        // set shown tags to new tags
        setShownTags(tagsArray)
      } else {
        console.log("tag not found")
        console.log("tagsArray => " + tagsArray)
        console.log("as a table:")
        console.table(tagsArray)
      }
    } catch (error) {
      throw new Error(`Tag "${tag}" not found`)
    }

    // re-render UI without deleted tag
    // console.log(`%c /////////////////`, "color: blue; font-size: 20px;")
    if (wasClicked.classList.contains("deletableTag")) {
      // remove tag from UI
      wasClicked.remove()
    } else {
      console.log("user clicked on icon instead of tag")
      // user clicked on icon instead of tag

      console.log("with id => deleteTagIcon-" + idNumber)
      let tagElement = document.getElementById("tag-" + idNumber)
      console.log("tagElement id => " + tagElement.id)
      tagElement.remove()

      // remove the svg icon
      wasClicked.remove()
    }

    // & show save button
    document
      .getElementById("saveTagDeletionButton")
      .classList.remove("invisible")

    // former auto-save functionality
    // deleteTagsFromServer(tagsArray)
  }

  // used when user clicks on 'save' button after tag deletion
  function deleteTagsFromServer(shownTags) {
    console.log(`%c /////////////////`, "color: red; font-size: 20px;")
    console.log(`%c function: [ deleteTagsFromServer ]`, "color: red;")
    console.log(`%c shownTags type => ${typeof shownTags}`, "color: red;")
    console.log(`%c shownTags => ${shownTags}`, "color: red;")

    // console.log("shownTags => " + shownTags)
    // console.log("type of shownTags => " + typeof shownTags)
    // console.log("as a table:")
    // console.table(shownTags)

    shownTags = shownTags.toString()

    // requires String
    updateTagsOnServer(shownTags)
  }

  function updateTagsOnServer(newTags) {
    console.log(`%c /////////////////`, "color: #89cff0; font-size: 20px;")
    console.log(`%c function: [ updateTagsOnServer ]`, "color: #89cff0;")
    console.log(`%c newTags type => ${typeof newTags}`, "color: #89cff0;")
    console.log(`%c newTags => ${newTags}`, "color: #89cff0;")

    // TODO: replace with dynamic handle
    let handle = "dnt.is"

    const apiURL = `http://localhost:5678/api/v1/profiles/${handle}/tags`

    fetch(apiURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        JSON.parse(
          JSON.stringify({
            tags: newTags,
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

    // re-render UI
    // set tags to new ones
    setTags(newTags.toString())

    // set reload to true
    setReload(true)
  }
}
