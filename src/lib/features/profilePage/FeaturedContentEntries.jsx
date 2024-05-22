"use client"

// imports for UI /.
import { IconMapper } from "@/components/iconMapper"
import { Card } from "@/components/ui/card"
import { PenIconButton } from "@/components/ui/penIconButton"
import { DeleteCrossIconButton } from "@/components/ui/DeleteCrossIconButton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
// imports for UI ./

import React, { useEffect, useState, useId, useContext, use } from "react"
import { useDispatch } from "react-redux"
import { nanoid } from "@reduxjs/toolkit"

// to update the interactability status
import { ProfilePageContext } from "@/app/[handle]/utils/ProfilePageContext"

// to read data from the Redux store
import { useSelector } from "react-redux"

// specific CRUD actions for this feature
import { fetchFeaturedContent } from "@/lib/features/profilePage/featuredContentSlice"

// imports for sorting functionality /.
// import { SortableLinkNode } from "@/lib/utils/SortableLinkNode/SortableLinkNode"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
// imports for sorting functionality ./

// debug support function
import { announce } from "@/lib/utils/debugTools/announce"

export const FeaturedContentEntries = ({ handle, mode, sectionTitle }) => {
  // for changing editable modes
  const [featuredContentIsSortable, setFeaturedContentIsSortable] =
    useState(false)

  // for adding featured content
  const [addRequestStatus, setAddRequestStatus] = useState("idle")
  let editableContentTitle = ""
  let editableContentDescription = ""
  let editableContentUrl = ""
  let editableContentCategory = ""

  const dispatch = useDispatch()
  // useSelector is a hook that allows you to extract data
  // from the Redux store state
  const featuredContent = useSelector(
    (state) => state.featuredContent.contentList
  )

  announce("TOP LEVEL featuredContent", featuredContent)

  const featuredContentStatus = useSelector(
    (state) => state.featuredContent.status
  )

  // backend always sends content in order
  const featuredContentByPosition = JSON.parse(JSON.stringify(featuredContent))

  // TODO: find the obsolete part
  // "there's something wrong, I can feel it" /.
  // to make sure content is always added at the end
  let initialLastPosition = null
  let initialAmountOfFeaturedContent = 0
  if (featuredContentByPosition.length > 0) {
    initialLastPosition =
      featuredContentByPosition[featuredContentByPosition.length - 1].position
    initialAmountOfFeaturedContent = featuredContentByPosition.length
  }

  // to make sure links are always added at the end
  const [nextHighestPosition, setNextHighestPosition] = useState(0)
  // "there's something wrong, I can feel it" ./

  announce("TOP LEVEL featuredContentByPosition", featuredContentByPosition)

  useEffect(() => {
    if (featuredContentStatus === "idle") {
      dispatch(fetchFeaturedContent(handle))
    }

    // if content was added we need to update the nextHighestPosition
    checkNextHighestPosition(
      initialAmountOfFeaturedContent,
      initialLastPosition,
      featuredContentByPosition,
      setNextHighestPosition
    )

    // de-activate 'change order' button if there's not more than 1 featured content
    checkChangeOrderButton(featuredContentByPosition)
  }, [featuredContentStatus, dispatch, featuredContentByPosition])

  // switches for content rendering /.
  if (featuredContentStatus === "loading") {
    return <div>Loading... {sectionTitle}</div>
  }

  if (featuredContentStatus === "failed") {
    return <div>Failed to load {sectionTitle}</div>
  }

  if (featuredContentStatus === "succeeded" && mode === "linked") {
    return (
      <div>
        <h2 className="section-title">{sectionTitle}</h2>
        <ClickableFeaturedContent
          featuredContentByPosition={featuredContentByPosition}
        />
      </div>
    )
  }

  if (featuredContentStatus === "succeeded" && mode === "editable") {
    if (featuredContentIsSortable) {
      return (
        <>
          <h2 className="section-title">{sectionTitle}</h2>
          <DraggableFeaturedContent
            setFeaturedContentIsSortable={setFeaturedContentIsSortable}
          />
        </>
      )
    }

    return (
      <>
        <h2 className="section-title">{sectionTitle}</h2>
        <EditableFeaturedContent />
        <div className="flex justify-end">
          <Button
            id="activateReorderLinkCollectionButton"
            variant="outline"
            className="bg-white text-black"
            onClick={() => setFeaturedContentIsSortable(true)}
          >
            change order
          </Button>
        </div>
      </>
    )
  }
  // switches for content rendering ./
}

function ClickableFeaturedContent({ featuredContentByPosition }) {
  return featuredContentByPosition.map((content) => {
    return (
      <Card key={content.category + content.position} className="my-4">
        <a href={content.url} target="_blank">
          <div className="flex">
            <div className="text-5xl py-4 px-2">
              <IconMapper url={content.category + ":"} />
            </div>
            <div className="grow p-2">
              <span>{content.title.length > 0 ? content.title : ""}</span>
              <br />
              <span>
                {content.description.length > 0
                  ? content.description
                  : content.url}
              </span>
            </div>
          </div>
        </a>
      </Card>
    )
  })
}

function EditableFeaturedContent() {
  return <p>editable tbd</p>
}

function DraggableFeaturedContent({ setFeaturedContentIsSortable }) {
  return (
    <>
      <p>Pick up a link to change its position in the collection.</p>
      <p>
        <b>draggable tbd</b>
      </p>
      <div className="flex justify-end gap-5">
        <div>
          <Button
            id="cancelReorderedLinkCollectionButton"
            variant="outline"
            className="bg-white text-black"
            onClick={() => {
              setFeaturedContentIsSortable(false) // exit dnd-mode
            }}
          >
            cancel
          </Button>
        </div>
        <div>
          <Button
            id="saveReorderedLinkCollectionButton"
            variant="outline"
            className="bg-white text-black"
            onClick={() => {
              // TODO: onSaveUpdateClicked()
              setFeaturedContentIsSortable(false) // exit dnd-mode
            }}
          >
            save
          </Button>
        </div>
      </div>
    </>
  )
}

// support functions /.
function checkNextHighestPosition(
  initialAmountOfFeaturedContent,
  initialLastPosition,
  featuredContentByPosition,
  setNextHighestPosition
) {
  // cover the case when there's no content
  if (!featuredContentByPosition.length > 0) {
    setNextHighestPosition(0)
  }

  try {
    if (
      featuredContentByPosition.length > initialAmountOfFeaturedContent ||
      featuredContentByPosition[featuredContentByPosition.length - 1]
        .position !== initialLastPosition
    ) {
      setNextHighestPosition(
        featuredContentByPosition[featuredContentByPosition.length - 1]
          .position + 1
      )
    }
  } catch (error) {
    console.error("checkNextHighestPosition error:", error)
  }
}

function checkChangeOrderButton(featuredContentByPosition) {
  if (featuredContentByPosition.length < 2) {
    let changeOrderButton = document.getElementById(
      "activateReorderFeaturedContentButton"
    )
    if (changeOrderButton) {
      changeOrderButton.setAttribute("disabled", "disabled")
    }
  } else {
    // reset to default
    let changeOrderButton = document.getElementById(
      "activateReorderFeaturedContentButton"
    )
    if (changeOrderButton) {
      changeOrderButton.removeAttribute("disabled")
    }
  }
}

// support functions ./
