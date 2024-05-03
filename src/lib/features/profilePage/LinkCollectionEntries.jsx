"use client"

// imports for UI /.
import { IconMapper } from "@/components/iconMapper"
import { EditButton } from "@/components/ui/editButtonPen"
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
// imports for UI ./

import React, { useEffect, useState, useId, useContext } from "react"
import { useDispatch } from "react-redux"
import { nanoid } from "@reduxjs/toolkit"

// to update the interactability status
import { ProfilePageContext } from "@/app/[handle]/utils/ProfilePageContext"

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

// specificly for drag-and-drop functionality
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

  // to be used for all 3 modes
  const linkCollection = JSON.parse(JSON.stringify(links))
  // data gets sorted but position number can be anything
  const linkCollectionByPositionUnclean = linkCollection.toSorted(
    (a, b) => a.position - b.position
  )
  // TODO: check if skipping this solves the 'position' errors
  // to make sure the position always starts counting from 0
  const linkCollectionByPosition = linkCollectionByPositionUnclean
  // .map(
  //   (link, index) => {
  //     link.position = index
  //     return link
  //   }
  // )
  announce("[xPOSITION I]: linkCollection", linkCollection)
  announce(
    "[xPOSITION II]: linkCollectionByPositionUnclean",
    linkCollectionByPositionUnclean
  )
  announce(
    "[xPOSITION III]: linkCollectionByPosition",
    linkCollectionByPosition
  )

  announce("TOP LEVEL linkCollectionByPosition", linkCollectionByPosition)

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
        contentOfLinkCollection = generateDefault(linkCollectionByPosition)
        break

      case "draggable":
        contentOfLinkCollection = (
          <DraggableLinkCollection
            handle={handle}
            linkCollectionByPosition={linkCollectionByPosition}
          />
        )
        break

      case "editable":
        contentOfLinkCollection = (
          <CollectionOfEditableLinks
            linkCollectionByPosition={linkCollectionByPosition}
          />
        )
        break
    }
  }

  return <>{contentOfLinkCollection}</>
}

function generateDefault(linkCollectionByPosition) {
  return linkCollectionByPosition.map((link) => {
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
function DraggableLinkCollection({ handle, linkCollectionByPosition }) {
  const [updateRequestStatus, setUpdateRequestStatus] = useState("idle")
  const dispatch = useDispatch()

  announce("calibrating linkCollectionByPosition", linkCollectionByPosition)
  const [reorderedLinkCollection, setReorderedLinkCollection] = useState([
    linkCollectionByPosition,
  ])

  // to cancel the update
  const { setLinkCollectionIsSortable } = useContext(ProfilePageContext)

  return (
    <>
      <p>Pick up a link to change its position in the collection.</p>
      <DndFrame
        // linkCollection={linkCollection}
        linkCollectionByPosition={linkCollectionByPosition}
        setReorderedLinkCollection={setReorderedLinkCollection}
      />
      <div className="flex justify-end gap-5">
        <div>
          <Button
            id="cancelReorderedLinkCollectionButton"
            variant="outline"
            className="bg-white text-black"
            onClick={() => {
              setLinkCollectionIsSortable(false)
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
        "sending reorderedLinkCollection to backend (default positions):",
        reorderedLinkCollection
      )
      announce(
        "sending reorderedLinkCollection to backend (updated positions):",
        reorderedLinkCollection
      )

      // createAsyncThunk only takes one argument
      const updateData = {
        handle,
        links: reorderedLinkCollection,
      }
      dispatch(updateLinkCollection(updateData))
    } catch (error) {
      console.error("Failed to save the link collection: ", error)
    } finally {
      setUpdateRequestStatus("idle")
    }
  }
}

function DndFrame({ linkCollectionByPosition, setReorderedLinkCollection }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // used for drag-and-drop (reorder and transition animation)
  const [linkNodes, setLinkNodes] = useState(
    linkCollectionByPosition.map((linkNode) => {
      console.log("assigning linkNode.id based on uniqueId", linkNode.uniqueId)
      announce("linkCollection for linkNode", linkCollectionByPosition)
      linkNode.id = linkNode.uniqueId
      return linkNode
    })
  )

  // used to up-drill every time reorder happens
  useEffect(() => {
    setReorderedLinkCollection(linkNodes)

    announce("linkCollection within useEffect", linkCollectionByPosition)
  }, [linkNodes])

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
    const { active, over } = event

    console.log(`%c active.id => ${active.id}`, `color: green;`)
    console.log(`%c over.id => ${over.id}`, `color: green;`)

    if (active.id !== over.id) {
      setLinkNodes((items) => {
        const oldIndex = items.map((linkNode) => linkNode.id).indexOf(active.id)

        const newIndex = items.map((linkNode) => linkNode.id).indexOf(over.id)

        // swap positions (including the 'position' attribute)
        const newlySortedItems = arrayMove(items, oldIndex, newIndex)
        newlySortedItems.forEach((linkNode, index) => {
          linkNode.position = index
        })
        return newlySortedItems
      })
    }
  }
}

function CollectionOfEditableLinks({ linkCollectionByPosition }) {
  // to trigger re-render in effect
  const [updateRequestStatus, setUpdateRequestStatus] = useState("idle")
  const [deleteLinkRequestStatus, setDeleteLinkRequestStatus] = useState("idle")
  // TODO: this doesn't trigger... why?

  // served by parent component
  const [adaptableLinkCollection, setAdaptableLinkCollection] = useState(
    linkCollectionByPosition
  )

  // 'shadow copy' for updrill
  const [linkNodes, setLinkNodes] = useState(
    adaptableLinkCollection.map((linkNode) => {
      return linkNode
    })
  )
  // used to up-drill every time reorder happens
  useEffect(() => {
    // setAdaptableLinkCollection(linkNodes) // TODO: check if this causes overwrite of positions

    announce("adaptableLinkCollection", adaptableLinkCollection)

    announce("linkCollectionByPosition", linkCollectionByPosition) // this is the updated one
    // setAdaptableLinkCollection(linkCollectionByPosition)
    setLinkNodes(linkCollectionByPosition) // causes re-render after deletion
    // TODO: position needs to be re-assigned, too!
    // TODO: check if 'update' still works

    announce("updateRequestStatus:", updateRequestStatus)
  }, [
    linkNodes,
    updateRequestStatus,
    deleteLinkRequestStatus,
    linkCollectionByPosition,
  ])

  return linkNodes.map((link) => {
    let linkUrl = link.url
    let linkText = link.text
    let linkPosition = link.position

    announce("link", link)
    announce(
      `linkElementState at this position (${link.position})`,
      adaptableLinkCollection[link.position]
    )

    return (
      <div key={"linkItem-" + link.position}>
        {/* new component /. */}
        <div className="">
          <EditableLinkItem
            linkPosition={link.position}
            linkUrl={link.url}
            linkText={link.text}
            setUpdateRequestStatus={setUpdateRequestStatus}
            onSaveUpdatedLinkClicked={onSaveUpdatedLinkClicked}
            setDeleteLinkRequestStatus={setDeleteLinkRequestStatus}
          />
        </div>
        {/* new component ./ */}
      </div>
    )
  })
}

// Network and State-Management functions /.
async function onSaveUpdatedLinkClicked(
  handle,
  updatedLink,
  setUpdateRequestStatus,
  dispatch
) {
  console.log(
    `%c onSaveUpdatedLinkClicked!!`,
    "color: green; font-size: 1.5em;"
  )

  try {
    setUpdateRequestStatus("pending")

    // createAsyncThunk only takes one argument
    const updateData = {
      handle,
      updatedLink,
    }

    dispatch(updateLink(updateData))
  } catch (error) {
    console.error("Failed to save link: ", error)
  } finally {
    setUpdateRequestStatus("idle")
  }
}
// Network and State-Management functions ./

// UI interactions /.
function EditableLinkItem({
  linkPosition,
  linkUrl,
  linkText,
  setUpdateRequestStatus,
  onSaveUpdatedLinkClicked,
  setDeleteLinkRequestStatus,
}) {
  return (
    <>
      <div
        key={"pos-" + linkPosition + "-editable"}
        className="group/edit flex my-4 mx-2"
      >
        <div className="w-3/4 bg-konkikyou-blue py-0.5 px-3 mx-2">
          <LinkDisplay
            linkPosition={linkPosition}
            linkUrl={linkUrl}
            linkText={linkText}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <div className="bg-konkikyou-blue">
              <PenIconButton />
            </div>
          </DialogTrigger>
          <EditLinkDialog
            text={linkText}
            url={linkUrl}
            position={linkPosition}
            setUpdateRequestStatus={setUpdateRequestStatus}
            onSaveUpdatedLinkClicked={onSaveUpdatedLinkClicked}
          />
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <div className="bg-konkikyou-blue mx-2">
              <DeleteCrossIconButton />
            </div>
          </DialogTrigger>
          <DeleteLinkDialog
            linkPosition={linkPosition}
            setDeleteLinkRequestStatus={setDeleteLinkRequestStatus}
          />
        </Dialog>
      </div>
    </>
  )
}

// Dialog to update a link
function EditLinkDialog({
  text,
  url,
  position,
  setUpdateRequestStatus,
  onSaveUpdatedLinkClicked,
}) {
  // component-internal state
  const [linkText, setLinkText] = useState(text)
  const [linkUrl, setLinkUrl] = useState(url)
  const linkPosition = position

  // used for network and Redux state-management
  const dispatch = useDispatch()

  // reading from context
  const { handle } = useContext(ProfilePageContext)

  // update view independent of the backend
  useEffect(() => {
    announce("value changed -> linkText", linkText)
    let element = document.getElementById("linkText-" + linkPosition)
    element.innerHTML = linkText
  }, [linkText])

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Link</DialogTitle>
        <DialogDescription>
          Make changes to your link here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="linkText" className="text-right">
            Text
          </Label>
          <Input
            id={"linkTextInput-" + linkPosition}
            type="text"
            className="col-span-3"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="linkUrl" className="text-right">
            Link
          </Label>
          <Input
            id={"linkUrlInput-" + linkPosition}
            type="text"
            className="col-span-3"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose>
          <Button
            type="submit"
            onClick={() =>
              onSaveUpdatedLinkClicked(
                handle,
                {
                  url: linkUrl,
                  text: linkText,
                  position: linkPosition,
                },
                setUpdateRequestStatus,
                dispatch
              )
            }
          >
            Save changes
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

// Dialog to delete a link
function DeleteLinkDialog({ linkPosition, setDeleteLinkRequestStatus }) {
  // Hooks can only be called inside of the body of a function component.
  const { handle } = useContext(ProfilePageContext)

  // used for network and Redux state-management
  const dispatch = useDispatch()

  // // TOOD: check if needed (or can be deleted)
  // // to re-render
  // const [deleteLinkRequestStatus, setDeleteLinkRequestStatus] = useState("idle")

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Delete Link</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this link?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose>
          <Button
            type="submit"
            id="confirmLinkDeletion-Button"
            onClick={() =>
              onDeleteLinkClicked(
                linkPosition,
                handle,
                dispatch,
                setDeleteLinkRequestStatus
              )
            }
          >
            YES
          </Button>
          <Button type="submit" id="cancelLinkDeletion-Button">
            NO
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

function onDeleteLinkClicked(
  linkPosition,
  handle,
  dispatch,
  setDeleteLinkRequestStatus
) {
  console.log(
    `%c onDeleteLinkClicked for link at position '${linkPosition}', handle '${handle}'`,
    "color:green;font-size:1.5em;"
  )

  try {
    setDeleteLinkRequestStatus("pending")

    // createAsyncThunk only takes one argument
    const deletionData = {
      handle,
      linkPosition,
    }

    dispatch(deleteLink(deletionData))
  } catch (error) {
    console.error("Failed to delete link: ", error)
  } finally {
    setDeleteLinkRequestStatus("idle")
  }
}

function LinkDisplay({ linkPosition, linkUrl, linkText }) {
  return (
    <>
      <a>
        <IconMapper url={linkUrl} />
        <span id={"linkText-" + linkPosition} className="mx-2">
          {linkText.length > 0 ? linkText : linkUrl}
        </span>
      </a>
    </>
  )
}

// UI interactions ./
