"use client"

import { useContext } from "react"
import { ProfileContext } from "../ProfileProvider"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"

export default function Page() {
  return <Tags />
}

function Tags() {
  const profile = useContext(ProfileContext)
  // Check if profile or mainProfileData is not yet defined and return null or a loading state
  if (!profile || !profile.mainProfileData) {
    // You can return a loading spinner, a placeholder, or null to avoid rendering this component prematurely
    return <div>Loading...</div> // or return null;
  }
  const { mainProfileData } = profile
  const mainContent = mainProfileData.contentBox[0]

  return (
    <>
      {mainContent.tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex mx-1.5 my-1 px-3 py-0.45 rounded text-sm font-medium bg-white text-black"
        >
          {tag}
        </span>
      ))}
      <span className="inline-flex mx-1.5 my-auto px-3 py-0.45 rounded text-sm font-medium bg-gray-500 text-white">
        more
        <FontAwesomeIcon
          icon={faAngleRight}
          className="fas fa-angle-right text-xs my-auto my-2.45 ml-1 py-0.45"
        ></FontAwesomeIcon>
      </span>
    </>
  )
}
