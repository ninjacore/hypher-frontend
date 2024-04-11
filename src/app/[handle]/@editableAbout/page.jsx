"use client"

import React, { useContext, useState } from "react"
import { ProfileContext, Profile } from "../page.jsx"

import { Textarea } from "@/components/ui/textarea"
import { EditButton } from "@/components/ui/editButtonPen"
import { Button } from "@/components/ui/button"

// TODO: import main-profile-slice

export default function Page() {
  return (
    <Profile>
      <EditableAbout />
    </Profile>
  )
}

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

  if (editBio) {
    return (
      <>
        <Textarea placeholder="Type your message here." id="aboutText">
          {mainContent.bio}
        </Textarea>
        <Button
          variant="outline"
          onClick={() => {
            saveUpdatedBio(setEditBio)
          }}
        >
          save
        </Button>
      </>
    )
  } else {
    // default HTML

    return (
      <div onClick={() => setEditBio(true)}>
        {mainContent.bio}
        <EditButton />
      </div>
    )
  }
}

// Network interactions /.
function handleDataUpdate(aboutText) {
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
      bio: aboutText,
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
// Network interactions ./

// Mixed V-DOM & Data-manipulations /.
function saveUpdatedBio(setEditBio) {
  let textBuffer = document.getElementById("aboutText").value
  console.log("updated bio: ", textBuffer)

  // save to database
  handleDataUpdate(textBuffer)

  // reset view
  setEditBio(false)
}
// Mixed V-DOM & Data-manipulations ./
