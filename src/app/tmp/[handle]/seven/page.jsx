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
    fetch("http://localhost:5678/api/v1/profilePage/dnt.is")
      .then((res) => {
        if (!res.status.toString().startsWith("2")) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        setLoaded(true)
        console.log("res=")
        console.log(res)
        // promiese to decode the response body as json
        return res.json()
      })
      // once deconstructed, we can use the data
      .then((decodedResponse) => {
        console.log("decodedResponse=")
        console.log(decodedResponse)
      })
      .then((profileData) => {
        // split profile data to make it usable
        let splitData = splitProfileData(profileData)
        console.log("splitData=")
        console.log(splitData)
      })
    setData(value)
  }, [])

  return (
    <div>
      <p>{data}</p>
      <p>{"data loaded: " + loaded}</p>
    </div>
  )
}
