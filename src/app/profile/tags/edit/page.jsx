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

  // const [progress, setProgress] = useState(0)
  const [newTagsBuffer, setNewTagsBuffer] = useState(null)

  // get user tag by serving endpoint and having it as a query parameter
  let handle = "dnt.is"

  // {{SERVICE_IP}}:{{SERVICE_PORT}}/{{API_VERSION}}/profiles/dnt.is/tags

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
            console.log("res.data=")
            console.log(res.data)
            setTags(res.data)
            setLoaded(true)
          }
        })
    )
  }, [])

  useEffect(() => {
    colorProgressBar(33)
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
  let progressBarLength = 10

  // default
  let classBasedOnMaxTags = "bg-green-400"

  // classBasedOnMaxTags

  const innerHTML = tagsArray.map((tag) => {
    // update tag count to show if maxing out
    tagCount++
    // setProgress((tagCount / 50) * 100)
    progress = (tagCount / 50) * 100

    // set color based on how many tags are used
    // if (progress >= 100) {
    //   classBasedOnMaxTags = "bg-red-400"
    // } else if (progress >= 75) {
    //   classBasedOnMaxTags = "bg-yellow-400"
    // }

    return (
      <>
        <span
          key={"tag-" + tagCount}
          className="inline-flex mx-1.5 my-1 px-3 py-0.45 rounded text-sm font-medium bg-white text-black"
        >
          {tag}
        </span>
      </>
    )
  }, [])

  return (
    <div className="mx-1">
      <span>{tagCount} out of 50</span>
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
            <Button variant="outline" className="bg-white text-black">
              REORDER
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <div className="group/edit">
                  <Button variant="outline" className="bg-white text-black">
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
                        updateTagText(newTagsBuffer)
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
}

function updateTagText(newTagsBuffer) {
  console.log("updateTagText => " + newTagsBuffer)

  let progressBarElement = document.getElementById("tagsProgressBar")
  // if (progressBarElement == null) {
  //   console.log("progressBarElement is null")
  // } else {
  //   let progress = progressBarElement.getAttribute("value")
  //   progressBarElement.firstChild.className =
  //     "h-full w-full flex-1 bg-yellow-400"
  // }
}

function colorProgressBar(progress) {
  //   console.log(
  //     `%c colorProgressBar => ${progress}`,
  //     "color: cyan; font-weight: bold;"
  //   )
  //   let progressBarElement = document.getElementById("tagsProgressBar")
  //   if (progressBarElement == null) {
  //     console.log(
  //       `%c progressBarElement is null`,
  //       "color: red; font-weight: bold;"
  //     )
  //   } else {
  //     progressBarElement.firstChild.className =
  //       "h-full w-full flex-1 bg-yellow-400"
  //   }
}
