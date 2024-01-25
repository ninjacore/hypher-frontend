"use client"

import { createContext, useState } from "react"

// TODO: replace with real data from backend
import profileData from "./tmpDB/profile-data.json"

import splitProfileData from "./components/splitProfileData"

// split data into categorized data sets
const categorizedProfileData = splitProfileData(profileData)

const ProfileContext = createContext(categorizedProfileData)

function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(categorizedProfileData)

  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  )
}

export { ProfileContext, ProfileProvider }
