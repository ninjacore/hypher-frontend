"use client"
import React, { createContext, useState, useEffect } from "react"

// You might not need this import if you're not using the local file anymore
// import profileData from "./tmpDB/profile-data.json";

import splitProfileData from "./components/splitProfileData"

const ProfileContext = createContext()

function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({}) // Initialize profile state as empty

  useEffect(() => {
    // Function to fetch profile data
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5678/api/v1/profilePage/dnt.is"
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        const categorizedData = splitProfileData(data) // Assuming your splitProfileData function can handle the data structure from your backend
        setProfile(categorizedData) // Update state with fetched and processed data
      } catch (error) {
        console.error("Failed to fetch profile data:", error)
      }
    }

    fetchProfileData()
  }, []) // Empty dependency array means this effect runs once on mount

  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  )
}

export { ProfileContext, ProfileProvider }
