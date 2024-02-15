"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import splitProfileData from "./utils/splitProfileData"

// creating context to use later and in child components
export const ProfileContext = createContext(null)

export default function Page() {
  return (
    <div>
      <Profile />
    </div>
  )
}

export function Profile({ children }) {
  // to make sure state is updated once we get the data pt.1
  const [data, setData] = useState(null)
  const [loaded, setLoaded] = useState(false)

  // get handle from url of this page
  const url = window.location.href
  const handle = url.split("/").pop()
  console.log("handle=")
  console.log(handle)

  const apiUrl = `http://localhost:5678/api/v1/profilePage/${handle}`

  // to make sure state is updated once we get the data pt.2
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
            // split profile data to make it usable
            let splitData = splitProfileData(res.data)
            console.log("splitData=")
            console.log(splitData)
            setData(splitData)
            setLoaded(true)
          }
        })
    )
  }, [])

  return (
    <>
      <ProfileContext.Provider value={data}>{children}</ProfileContext.Provider>
    </>
  )
}
