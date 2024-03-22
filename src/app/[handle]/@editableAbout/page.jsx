"use client"

import React, { useContext, useState } from "react"
import { ProfileContext, Profile } from "../page.jsx"

import { Textarea } from "@/components/ui/textarea"
import { EditButton } from "@/components/ui/editButtonPen"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <Profile>
      <EditableAbout />
    </Profile>
  )
}

// function EditableAbout() {
//   const profile = useContext(ProfileContext)
//   // Check if profile or mainProfileData is not yet defined and return null or a loading state
//   if (!profile || !profile.mainProfileData) {
//     // You can return a loading spinner, a placeholder, or null to avoid rendering this component prematurely
//     return <div>Loading...</div> // or return null;
//   }
//   const { mainProfileData } = profile
//   const mainContent = mainProfileData.contentBox?.[0]

//   return <>{mainContent.bio}</>
// }

function EditableAbout() {
  const profile = useContext(ProfileContext)
  const [editBio, setEditBio] = useState(false)

  // Check if profile or mainProfileData is not yet defined and return null or a loading state
  if (!profile || !profile.mainProfileData) {
    // You can return a loading spinner, a placeholder, or null to avoid rendering this component prematurely
    return <div>Loading...</div> // or return null;
  }
  const { mainProfileData } = profile
  const mainContent = mainProfileData.contentBox?.[0]

  // return <>{mainContent.bio}</>

  // TODO: create action to update bio in database
  return (
    <div onClick={() => setEditBio(true)}>
      {editBio ? (
        <>
          <Textarea placeholder="Type your message here." id="aboutText">
            {mainContent.bio}
          </Textarea>
          <Button
            variant="outline"
            onClick={() => {
              saveUpdatedBio()
            }}
          >
            ok
          </Button>
        </>
      ) : (
        <>{mainContent.bio}</>
      )}
      {editBio ? <></> : <EditButton />}
    </div>
  )
}

function saveUpdatedBio() {
  let textBuffer = document.getElementById("aboutText").value
  console.log("updated bio: ", textBuffer)

  // TODO: update context (so change shows for user)

  // save to database
  // {{SERVICE_IP}}:{{SERVICE_PORT}}/{{API_VERSION}}/profiles/dnt.is/about
  // get handle from url of this page
  const url = window.location.href
  const handle = url.split("/").pop()
  console.log("handle=")
  console.log(handle)

  const apiURL = `http://localhost:5678/api/v1/profiles/${handle}/about`

  fetch(apiURL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bio: textBuffer,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data)
      return data
    })
    .catch((error) => {
      console.error("Error:", error)
      return error
    })
}
