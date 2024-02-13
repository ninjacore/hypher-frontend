"use client"
import { useContext, useEffect, useState } from "react"
import splitProfileData from "./splitProfileData"

export default function Page() {
  return (
    <div>
      <ValueOfInterest />
    </div>
  )
}

function ValueOfInterest() {
  let value = "a"

  // to make sure state is updated once we get the data pt.1
  const [data, setData] = useState(null)
  const [loaded, setLoaded] = useState(false)

  // to make sure state is updated once we get the data pt.2
  useEffect(() => {
    // fetch("http://localhost:5678/api/v1/profilePage/dnt.is").then(() =>
    //   setLoaded(true)
    // )
    // fetch("http://localhost:5678/api/v1/profilePage/dnt.is")
    //   .then((res) => {
    //     if (!res.status.toString().startsWith("2")) {
    //       throw new Error(`HTTP error! status: ${res.status}`)
    //     }
    //     setLoaded(true)
    //     console.log("res=")
    //     console.log(res)
    //     // promiese to decode the response body as json
    //     return res.json()
    //   })
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
    <div>
      <p>{data}</p>
      <p>{"data loaded: " + loaded}</p>
    </div>
  )
}
