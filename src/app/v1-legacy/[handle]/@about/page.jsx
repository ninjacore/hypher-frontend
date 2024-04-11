"use client"

import { useContext } from "react"
// import { ProfileContext } from "../ProfileProvider"
import { ProfileContext, Profile } from "../page.jsx"

export default function Page() {
  return (
    <Profile>
      <About />
    </Profile>
  )
}

function About() {
  const profile = useContext(ProfileContext)
  // Check if profile or mainProfileData is not yet defined and return null or a loading state
  if (!profile || !profile.mainProfileData) {
    // You can return a loading spinner, a placeholder, or null to avoid rendering this component prematurely
    return <div>Loading...</div> // or return null;
  }
  const { mainProfileData } = profile
  const mainContent = mainProfileData.contentBox?.[0]

  return <>{mainContent.bio}</>
}
