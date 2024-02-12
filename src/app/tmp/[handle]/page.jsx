"use client"
import { useState, useEffect } from "react"

import splitProfileData from "../../[handle]/components/splitProfileData"

function Profile() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)

  // get handle from url of this page
  const url = window.location.href
  const handle = url.split("/").pop()
  console.log("handle=")
  console.log(handle)

  const apiUrl = `http://localhost:5678/api/v1/profilePage/${handle}`

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => {
        if (!res.status.toString().startsWith("2")) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        let splitData = splitProfileData(data)
        setData(splitData)
        setLoading(false)
      })
    // .then((data) => {
    //   setData(data)
    //   setLoading(false)
    // })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>

  return (
    <div>
      <p>{data.mainProfileData.contentType.toString()}</p>
      <p>{data.linkCollectionData.contentType.toString()}</p>
      <p>{data.featuredContentData.contentType.toString()}</p>
    </div>
  )
}

export default Profile
