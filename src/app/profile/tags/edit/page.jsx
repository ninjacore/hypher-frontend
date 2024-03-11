"use client"
import React, { use, useEffect, useState } from "react"

import { TagNode } from "@/app/profile/tags/components/TagNode/TagNode"

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
  const htmlWithTags = ""

  // load tags from API
  useEffect(() => {
    setKnownTagsAsString(loadTagsFromAPI())
  }, [])

  //   // OBOSLETE
  //   // track loading state
  //   useEffect(() => {
  //     if (knownTagsAsString > 0) {
  //       setTagsLoadedFromSource(true)
  //     }
  //   }, [knownTagsAsString])

  // turn tags into TagNodes
  useEffect(() => {
    if (tagsLoadedFromSource) {
      // for testing
      announce("got tags from API", knownTagsAsString)

      let tagNodesListed = turnTagsIntoTagNodes(knownTagsAsString)
      setKnownTags(tagNodesListed)
    }
  }, [tagsLoadedFromSource])

  // render tags
  useEffect(() => {
    // for testing
    announce("populated tag nodes", knownTags)

    // do something with those known tags lke rendering the innerHTML
    const htmlWithTags = renderTags(knownTags)
  }, [knownTags])

  // render page with tags
  return (
    <>
      <h2>Your Favorite Tags</h2>
      <div>TODO: render tags here</div>
    </>
  )

  // default while waiting for data
  if (!tagsLoadedFromSource) {
    return (
      <>
        <h2>Your Favorite Tags</h2>
        <div>Loading...</div>
      </>
    )
  }
}

function loadTagsFromAPI() {
  // get user tag by serving endpoint and having it as a query parameter
  let handle = "dnt.is"

  const apiUrl = `http://localhost:5678/api/v1/profiles/${handle}/tags`

  let knownTagsAsString = ""
  let tagsCouldBeLoaded = false

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
  let tagsArray = tags.split(",")

  // create TagNodes
  let tagNodes = []
  tagsArray.forEach((tag) => {
    // create TagNode
    let tagNode = new TagNode(tag)

    // connect nodes
    if (tagNodes.length > 0) {
      tagNodes[tagNodes.length - 1].insertAfter(tagNode)
    }

    // add to tracking list
    tagNodes.push(tagNode)
  })

  return tagNodes
}

function renderTags(knownTagsList) {
  return (
    <div>
      <p>rendered Tags lol</p>
    </div>
  )
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

    default:
      colorCode = "#eee600" // titanium yellow
      break
  }

  console.log(`%c /////////////////`, `color: ${colorCode}; font-size: 20px;`)
  console.log(`%c ${announcement}`, `color: ${colorCode};`)

  if (objectToLog) {
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
