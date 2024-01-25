"use client"

import { useContext } from "react"
import { ProfileContext } from "../ProfileProvider"

export default function Page() {
  return <Name />
}

function Name() {
  const profile = useContext(ProfileContext)
  const { mainProfileData } = profile
  const mainContent = mainProfileData.contentBox[0]

  return <>{mainContent.name}</>
}
