"use client"

import React, { useState, useContext } from "react"
import { ProfilePageContext } from "@/app/[handle]/utils/ProfilePageContext"

import { Button } from "@/components/ui/button"
import { EditButton } from "@/components/ui/editButtonPen"
import { Card, CardContent, CardSingleLineHeader } from "@/components/ui/card"

// TODO: delete , temp while building
import {
  TagsHTMLTEMP,
  AboutHtmlTemp,
} from "@/app/[handle]/utils/temporary/ProfilePageHtmlSnippets"

// to be handled by token
const pageOwner = true

export default function Layout({
  linkCollection,
  editableLinkCollection,
  featured,
  editableFeatured,
}) {
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
              Master of the Universe
            </h1>
            <ProfilePageButton
              isOwner={pageOwner}
              editMode={editMode}
              setEditMode={setEditMode}
            />
          </CardSingleLineHeader>
          <CardContent>
            <div className="px-1 py-2 group/edit">
              {/* {editableAbout} */}
              <AboutHtmlTemp />
            </div>

            <div className="mt-2 px-1">
              <hr className="border-gray-400 border-t-2" />
            </div>
            {handle ? (
              <>
                <a href={"/profile/" + { handle } + "/tags/edit"}>
                  <div className="mt-2 group/edit">
                    {/* {tags} */}
                    <TagsHTMLTEMP />
                    <EditButton />
                  </div>
                </a>
              </>
            ) : (
              // <>No handle, cannot create linked tags field.</>
              // TODO: delete
              <div className="mt-2">
                <TagsHTMLTEMP />
              </div>
              // temp snippet
            )}
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardContent className="no-scroll-on-mobile">
            {editableLinkCollection}
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardContent>{editableFeatured}</CardContent>
        </Card>
        <hr />
        <div id="mobileMessageOutput"></div>
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
            Master of the Universe
          </h1>
          <ProfilePageButton
            isOwner={pageOwner}
            editMode={editMode}
            setEditMode={setEditMode}
          />
        </CardSingleLineHeader>
        <CardContent>
          <div className="px-1 py-2">
            {/* {about} */}
            <AboutHtmlTemp />
          </div>
          <div className="mt-2 px-1">
            <hr className="border-gray-400 border-t-2" />
          </div>
          <div className="mt-2">
            {/* {tags} */}
            <TagsHTMLTEMP />
          </div>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardContent>{linkCollection}</CardContent>
      </Card>
      <Card className="mb-6">
        <CardContent>{featured}</CardContent>
      </Card>
      <hr />
      <div id="mobileMessageOutput"></div>
    </>
  )
}

function ProfilePageButton({ isOwner, editMode, setEditMode }) {
  if (isOwner && editMode) {
    return (
      <Button
        variant="outline"
        className="bg-white text-black"
        onClick={() => setEditMode(false)}
      >
        {"exit editing"}
      </Button>
    )
  }

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
