"use client"

// imports for UI /.
import { IconMapper } from "@/components/iconMapper"
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

  // ["one", "two", "three"] //

  // if (featuredContent) {
  //   let data = JSON.parse(JSON.stringify(featuredContent))
  //   announce("TOP LEVEL data (featuredContent)", data)
  // }

  // to make sure content is always added at the end
  let lastInitialPosition = null
  let initialAmountOfFeaturedContent = 0
  if (featuredContentByPosition.length > 0) {
    lastInitialPosition =
      featuredContentByPosition[featuredContentByPosition.length - 1].position
    initialAmountOfFeaturedContent = featuredContentByPosition.length
  }

  announce("TOP LEVEL featuredContentByPosition", featuredContentByPosition)

  useEffect(() => {
    if (featuredContentStatus === "idle") {
      dispatch(fetchFeaturedContent(handle))
    }
  }, [featuredContentStatus, dispatch, featuredContentByPosition])

  // TODO: default
  return (
    <div>
      <h2 className="section-title">{sectionTitle}</h2>
      <ClickableFeaturedContent
        featuredContentByPosition={featuredContentByPosition}
      />
    </div>
  )
}

function ClickableFeaturedContent({ featuredContentByPosition }) {
  return featuredContentByPosition.map((content) => {
    return (
      <a href={content.url} target="_blank" key={content.frontendId}>
        <div className="my-4 mx-2 py-2 px-3 bg-green-300">
          <h3>{content.title}</h3>
          <p>{content.description}</p>
        </div>
      </a>
    )
  })
}
