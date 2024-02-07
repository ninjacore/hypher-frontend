"use client"
import { useState, useEffect } from "react"

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
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>

  return (
    <div>
      <p>{data}</p>
    </div>
  )
}

export default Profile
