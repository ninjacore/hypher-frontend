"use client"
import { useContext, useEffect, useState } from "react"

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
    fetch("http://localhost:5678/api/v1/profilePage/dnt.is").then(() =>
      setLoaded(true)
    )
    // setLoaded(true)
    value = "ab"
    setData(value)
  }, [])

  return (
    <div>
      <p>{data}</p>
      <p>{"data loaded: " + loaded}</p>
    </div>
  )
}
