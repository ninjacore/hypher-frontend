"use client"
import React, { createContext, useState, useEffect } from "react"

// load local file
// import profileData from "./tmpDB/profile-data.json";

import splitProfileData from "./components/splitProfileData"

const ProfileContext = createContext()

function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null)
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
        let profile = splitProfileData(data)
        setProfile(profile)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!profile) return <p>No profile data</p>

  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  )
}

export { ProfileContext, ProfileProvider }
