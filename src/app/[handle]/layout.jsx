"use client"

import React, { useState } from "react"

import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardSingleLineHeader,
  CardTitle,
} from "@/components/ui/card"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight, faPenToSquare } from "@fortawesome/free-solid-svg-icons"

import { EditButton } from "@/components/ui/editButtonPen"
// import { showTextArea } from "./utils/showTextArea"
// import { Textarea } from "@/components/ui/textarea"

const title = "Profile Page"

// to be handled by token
const pageOwner = true

// to be handley by button click
// const editMode = false

// export const metadata = {
//   title,
//   openGraph: {
//     title,
//     images: [`/api/og?title=${title}`],
//   },
// }

function ProfilePageButton({ isOwner, setEditMode }) {
  if (isOwner) {
    return (
      <Button
        variant="outline"
        className="bg-white text-black"
        onClick={() => setEditMode(true)}
      >
        {"edit"}
      </Button>
    )
  }

  return (
    <Button variant="outline" className="bg-white text-black">
      {"connect"}
    </Button>
  )
}

export default function Layout({
  name,
  about,
  editableAbout,
  tags,
  linkCollection,
  editableLinkCollection,
  featured,
  editableFeatured,
}) {
  const [editMode, setEditMode] = useState(false)

  // edit mode
  if (editMode) {
    // const [editBio, setEditBio] = useState(false)
    return (
      <>
        <Card className="mb-2">
          <CardSingleLineHeader className="flex justify-between my-4">
            <h1 className="text-3xl font-bold mx-1">{name}</h1>
          </CardSingleLineHeader>
          <CardContent>
            <div className="px-1 py-2 group/edit">{editableAbout}</div>

            <div className="mt-2 px-1">
              <hr className="border-gray-400 border-t-2" />
            </div>
            <a href={"/profile/" + getProfileHandle() + "/tags/edit"}>
              <div className="mt-2 group/edit">
                {tags}
                <EditButton />
              </div>
            </a>
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardContent>{editableLinkCollection}</CardContent>
        </Card>
        <Card className="mb-6">
          <CardContent>{editableFeatured}</CardContent>
        </Card>
      </>
    )
  }

  // view mode
  return (
    <>
      <Card className="mb-2">
        <CardSingleLineHeader className="flex justify-between my-4">
          <h1 className="text-3xl font-bold mx-1">{name}</h1>
          <ProfilePageButton isOwner={pageOwner} setEditMode={setEditMode} />
        </CardSingleLineHeader>
        <CardContent>
          <div className="px-1 py-2">{about}</div>
          <div className="mt-2 px-1">
            <hr className="border-gray-400 border-t-2" />
          </div>
          <div className="mt-2">{tags}</div>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardContent>{linkCollection}</CardContent>
      </Card>
      <Card className="mb-6">
        <CardContent>{featured}</CardContent>
      </Card>
    </>
  )
}

function getProfileHandle() {
  // get handle from url of this page
  const url = window.location.href
  const profileHandle = url.split("/").pop()

  return profileHandle
}
