"use client"

// imports for UI /.
import { IconMapper } from "@/components/iconMapper"
import { EditButton } from "@/components/ui/editButtonPen"
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
// imports for UI ./

import React, { useEffect, useState, useId } from "react"
import { useDispatch } from "react-redux"
import { nanoid } from "@reduxjs/toolkit"

// to read data from the Redux store
import { useSelector } from "react-redux"

// specific CRUD actions for this feature
import {
  fetchLinkCollection,
  updateLinkCollection,
  addNewLink,
  updateLink,
  deleteLink,
} from "@/lib/features/profilePage/linkCollectionSlice"
import { unwrapResult } from "@reduxjs/toolkit"

// speficly for drag-and-drop functionality
// import { useSortable } from "@dnd-kit/sortable"
import { SortableLinkNode } from "@/lib/utils/SortableLinkNode/SortableLinkNode"

// imports for sorting functionality /.
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

// specificly for

export const LinkCollectionEntries = ({ handle, mode }) => {
  const dispatch = useDispatch()
  // useSelector is a hook that allows you to extract data
  // from the Redux store state
  const links = useSelector((state) => state.linkCollection.links)

  const linkCollectionStatus = useSelector(
    (state) => state.linkCollection.status
  )

  useEffect(() => {
    if (linkCollectionStatus === "idle") {
      dispatch(fetchLinkCollection(handle))
    }
  }, [linkCollectionStatus, dispatch])

  let contentOfLinkCollection = []
  if (linkCollectionStatus === "loading") {
    contentOfLinkCollection = <div>Loading...</div>
  } else if (linkCollectionStatus === "failed") {
    contentOfLinkCollection = <div>Error!</div>
  } else if (linkCollectionStatus === "succeeded") {
    switch (mode) {
      case "linked":
        contentOfLinkCollection = generateDefault(links)
        break

      case "draggable":
        // contentOfLinkCollection = generateDraggable()
        contentOfLinkCollection = <DraggableLinkCollection handle={handle} />
        break

      case "editable":
        contentOfLinkCollection = generateEditable(links)
        break
    }
  }

  return <>{contentOfLinkCollection}</>
}

function generateDefault(links) {
  return links.map((link) => {
    return (
      <a href={link.url} target="_blank" key={"pos-" + link.position}>
        <div className="my-4 mx-2 py-2 px-3 bg-konkikyou-blue">
          <IconMapper url={link.url} />
          <span className="mx-2">
            {link.text.length > 0 ? link.text : link.url}
          </span>
        </div>
      </a>
    )
  })
}

// function generateDraggable() {
function DraggableLinkCollection({ handle }) {
  const [updateRequestStatus, setUpdateRequestStatus] = useState("idle")
  const dispatch = useDispatch()

  // useSelector is a hook that allows you to extract data
  // from the Redux store state
  const links = useSelector((state) => state.linkCollection.links)

  // make a mutable copy of links
  const linkCollection = JSON.parse(JSON.stringify(links))

  const [reorderedLinkCollection, setReorderedLinkCollection] = useState([
    linkCollection,
  ])

  return (
    <>
      <p>Pick up a link to change its position in the collection.</p>
      <DndFrame
        linkCollection={linkCollection}
        setReorderedLinkCollection={setReorderedLinkCollection}
      />
      <div className="flex justify-end gap-5">
        <div>
          <Button
            id="cancelReorderedLinkCollectionButton"
            variant="outline"
            className="bg-white text-black"
            onClick={() => {
              cancelLinkCollectionUpdate(setLinkCollectionIsSortable)
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
            onClick={onSaveUpdateClicked}
            // onClick={() => {
            //   setLinkCollectionReadyToUpdate(true)
            // }}
            // onClick={() => {
            //   updateFullLinkCollection(
            //     reorderedLinkCollection,
            //     setLinkCollectionIsSortable
            //   )
            // }}
          >
            save
          </Button>
        </div>
      </div>
    </>
  )

  async function onSaveUpdateClicked() {
    try {
      setUpdateRequestStatus("pending")
      announce(
        "sending reorderedLinkCollection to backend:",
        reorderedLinkCollection
      )

      const updateData = {
        handle,
        links: reorderedLinkCollection,
      }

      const resultAction = await dispatch(updateLinkCollection(updateData))
      unwrapResult(resultAction)
    } catch (error) {
      console.error("Failed to save the link collection: ", error)
    } finally {
      setUpdateRequestStatus("idle")
    }
  }
}

function DndFrame({ linkCollection, setReorderedLinkCollection }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // // useSelector is a hook that allows you to extract data
  // // from the Redux store state
  // const links = useSelector((state) => state.linkCollection.links)

  // // make a mutable copy of links
  // const linkCollection = JSON.parse(JSON.stringify(links))

  // used for drag-and-drop (reorder and transition animation)
  const [linkNodes, setLinkNodes] = useState(
    linkCollection.map((linkNode) => {
      linkNode.id = linkNode.uniqueId
      return linkNode
    })
  )

  // TODO: save via Redux instead (possibly one level higher, though...)
  // —— ** POSSIBLY OBSOLETE ** ——  /.
  // const [reorderedLinkCollection, setReorderedLinkCollection] = useState([
  //   linkCollection,
  // ])

  // used to up-drill every time reorder happens
  useEffect(() => {
    setReorderedLinkCollection(linkNodes) // V1

    // this should only happen if user clicks save.
    // dispatch(updateLinkCollection(handle, linkNodes)) // V2

    // announce("to be saved linkNodes", linkNodes)
    announce("linkCollection", linkCollection)
    // announce("to be saved reorderedLinkCollection", reorderedLinkCollection)
  }, [linkNodes])
  // —— ** POSSIBLY OBSOLETE ** ——  ./

  // for debugging
  let counter = 0

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      id={useId()}
    >
      <SortableContext items={linkNodes} strategy={verticalListSortingStrategy}>
        {/* <DraggableLinkElements links={links} /> */}
        {linkNodes.map((linkNode) => {
          console.log("round #" + counter + " id is: " + linkNode.id)
          counter++

          return (
            <SortableLinkNode
              key={linkNode.position}
              id={linkNode.uniqueId}
              text={linkNode.text}
              url={linkNode.url}
            />
          )
        })}
      </SortableContext>
    </DndContext>
  )

  function handleDragEnd(event) {
    // announce("handleDragEnd", event)
    // announce("known Links:", linkCollection)

    const { active, over } = event

    console.log(`%c active.id => ${active.id}`, `color: green;`)
    console.log(`%c over.id => ${over.id}`, `color: green;`)

    if (active.id !== over.id) {
      setLinkNodes((items) => {
        const oldIndex = items.map((linkNode) => linkNode.id).indexOf(active.id)

        const newIndex = items.map((linkNode) => linkNode.id).indexOf(over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }
}

function generateEditable(links) {
  return <>to be implemented...</>
}
