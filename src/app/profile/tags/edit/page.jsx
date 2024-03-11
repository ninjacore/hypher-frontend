"use client"
import React, { use, useEffect, useState } from "react"

import { TagNode } from "@/app/profile/tags/components/TagNode/TagNode"

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

  function popTag(event, tagNode) {
    let tagNodeId = event.target.getAttribute("data-tag-id")

    announce("user popped tag with id =>", tagNodeId)

    hideTag(tagNode)
    markTagForDeletion(tagNode)
    // TODO: show 'save' and 'cancel' buttons
    saveTagState()
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
