"use client"

import { useContext } from "react"
import { Profile } from "../page.jsx"
import { ProfilePageContext } from "../ProfilePageContext"

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

  const { handle } = useContext(ProfilePageContext)
  console.log("typeof profile [useContext(ProfileContext)] =" + typeof handle)
  console.log("profile=")
  console.table(handle)
  // Check if profile or mainProfileData is not yet defined and return null or a loading state
  if (!handle) {
    // You can return a loading spinner, a placeholder, or null to avoid rendering this component prematurely
    return <div>Loading...</div> // or return null;
  }

  return <>{handle}</>
}
