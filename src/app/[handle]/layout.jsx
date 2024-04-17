"use client"

import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import { EditButton } from "@/components/ui/editButtonPen"
import { Card, CardContent, CardSingleLineHeader } from "@/components/ui/card"

// to be handled by token
const pageOwner = true

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
