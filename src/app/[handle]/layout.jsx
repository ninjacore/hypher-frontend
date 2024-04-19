"use client"

import React, { useState, useContext } from "react"
import { ProfilePageContext } from "@/app/[handle]/utils/ProfilePageContext"

import { Button } from "@/components/ui/button"
import { EditButton } from "@/components/ui/editButtonPen"
import { Card, CardContent, CardSingleLineHeader } from "@/components/ui/card"

// to be handled by token
const pageOwner = true

export default function Layout({ linkCollection, editableLinkCollection }) {
  const [editMode, setEditMode] = useState(false)
  const { handle } = useContext(ProfilePageContext)

  // edit mode
  if (editMode) {
    return (
      <>
        <Card className="mb-2">
          <CardSingleLineHeader className="flex justify-between my-4">
            <h1 className="text-3xl font-bold mx-1">
              {/* {name} */}
              Setting up name...
            </h1>
          </CardSingleLineHeader>
          <CardContent>
            <div className="px-1 py-2 group/edit">
              {/* {editableAbout} */}
              Setting up editableAbout...
            </div>

            <div className="mt-2 px-1">
              <hr className="border-gray-400 border-t-2" />
            </div>
            {handle ? (
              <>
                <a href={"/profile/" + { handle } + "/tags/edit"}>
                  <div className="mt-2 group/edit">
                    {/* {tags} */}
                    Setting up tags...
                    <EditButton />
                  </div>
                </a>
              </>
            ) : (
              <>No handle, cannot create linked tags field.</>
            )}
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardContent>{editableLinkCollection}</CardContent>
        </Card>
        <Card className="mb-6">
          <CardContent>
            {/* {editableFeatured} */}
            Setting up editableFeatured...
          </CardContent>
        </Card>
      </>
    )
  }

  // view mode
  return (
    <>
      <Card className="mb-2">
        <CardSingleLineHeader className="flex justify-between my-4">
          <h1 className="text-3xl font-bold mx-1">
            {/* {name} */}
            Setting up name...
          </h1>
          <ProfilePageButton isOwner={pageOwner} setEditMode={setEditMode} />
        </CardSingleLineHeader>
        <CardContent>
          <div className="px-1 py-2">
            {/* {about} */}
            Setting up about...
          </div>
          <div className="mt-2 px-1">
            <hr className="border-gray-400 border-t-2" />
          </div>
          <div className="mt-2">
            {/* {tags} */}
            Setting up tags...
          </div>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardContent>{linkCollection}</CardContent>
      </Card>
      <Card className="mb-6">
        <CardContent>
          {/* {featured} */}
          Setting up featured...
        </CardContent>
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
