"use client"
import React, { createContext, useContext, useEffect, useState } from "react"

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

            // // split profile data to make it usable
            // let splitData = splitProfileData(res.data)
            // console.log("splitData=")
            // console.log(splitData)
            // setData(splitData)
            // setLoaded(true)
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

  let tagCount = 0

  // display tags within scroll-area
  return (
    <>
      <h2>Your Favorite Tags</h2>
      <div>
        {tagsArray.map((tag) => (
          <span
            key={"tag-" + tagCount++}
            className="inline-flex mx-1.5 my-1 px-3 py-0.45 rounded text-sm font-medium bg-white text-black"
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  )
}
