"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import splitProfileData from "./splitProfileData"

// creating context to use later and in child components
export const ProfileContext = createContext(null)

export default function Page() {
  return (
    <div>
      <ValueOfInterest />
    </div>
  )
}

export function ValueOfInterest({ children }) {
  // to make sure state is updated once we get the data pt.1
  const [data, setData] = useState(null)
  const [loaded, setLoaded] = useState(false)

  // to make sure state is updated once we get the data pt.2
  useEffect(() => {
    let url = "http://localhost:5678/api/v1/profilePage/dnt.is"
    fetch(url)
      .then((response) =>
        response
          .json()
          .then((data) => ({
            data: data,
            status: response.status,
          }))
          .then((res) => {
            console.log("decodedResponse=", res)
          })
      )
      // once deconstructed, we can use the data
      .then((profileData) => {
        // split profile data to make it usable
        let splitData = splitProfileData(profileData)
        console.log("splitData=")
        console.log(splitData)
        setData(splitData.mainProfileData.contentType.toString())
        setLoaded(true)
      })
  }, [])

  return (
    <>
      <ProfileContext.Provider value={data}>{children}</ProfileContext.Provider>
    </>
  )
}
