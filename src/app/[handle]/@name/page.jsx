"use client"

import { useContext } from "react"
import { ProfileContext, Profile } from "../page.jsx"

// TODO: import main-profile-slice

export default function Page() {
  return (
    <Profile>
      <Name />
    </Profile>
  )
}

function Name() {
  console.log("function Name() running...")

  const profileHandle = useContext(ProfileContext)
  console.log(
    "typeof profile [useContext(ProfileContext)] =" + typeof profileHandle
  )
  console.log("profile=")
  console.table(profileHandle)
  // Check if profile or mainProfileData is not yet defined and return null or a loading state
  if (!profileHandle) {
    // You can return a loading spinner, a placeholder, or null to avoid rendering this component prematurely
    return <div>Loading...</div> // or return null;
  }
  // // const { mainProfileData } = profileHandle
  // // const mainContent = mainProfileData.contentBox?.[0]

  return <>{profileHandle}</>

  // return <>{mainContent.name}</>
}
