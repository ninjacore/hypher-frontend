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
import {
  fetchLinkCollection,
  updateLinkCollection,
  addNewLink,
  updateLink,
  deleteLink,
} from "@/lib/features/profilePage/linkCollectionSlice"
import { unwrapResult } from "@reduxjs/toolkit"

// imports for sorting functionality /.
import { SortableLinkNode } from "@/lib/utils/SortableLinkNode/SortableLinkNode"
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

export const LinkCollectionEntries = ({ handle, mode, sectionTitle }) => {
  // for adding links
  const [addRequestStatus, setAddRequestStatus] = useState("idle")
  let editableLinkText = ""
  let editableLinkUrl = ""

  const dispatch = useDispatch()
  // useSelector is a hook that allows you to extract data
  // from the Redux store state
  const links = useSelector((state) => state.linkCollection.links)

  const linkCollectionStatus = useSelector(
    (state) => state.linkCollection.status
  )

  // backend always sends the links in order
  const linkCollectionByPosition = JSON.parse(JSON.stringify(links))

  // to make sure links are always added at the end
  let lastInitialPosition = null
  let initialAmountOfLinks = 0
  if (linkCollectionByPosition.length > 0) {
    lastInitialPosition =
      linkCollectionByPosition[linkCollectionByPosition.length - 1].position
    initialAmountOfLinks = linkCollectionByPosition.length
  }

  announce("TOP LEVEL linkCollectionByPosition", linkCollectionByPosition)

  useEffect(() => {
    // only for debugging 'position' issue
    announce("linkCollectionStatus is :", linkCollectionStatus)
    announce("linkCollection is :", linkCollectionByPosition)

    if (linkCollectionStatus === "idle") {
      dispatch(fetchLinkCollection(handle))
    }

    // to make sure links are always added at the end
    if (linkCollectionByPosition.length > 0) {
      // needs to reflect positions as they were initially given by the backend
      setNextHighestPosition(lastInitialPosition + 1)

      // if a link was added we need to update the nextHighestPosition
      if (
        linkCollectionByPosition.length > initialAmountOfLinks ||
        linkCollectionByPosition[linkCollectionByPosition.length - 1]
          .position !== lastInitialPosition
      ) {
        console.log("link was added to linkCollection")

        // consistently add up while links are added
        setNextHighestPosition(
          linkCollectionByPosition[linkCollectionByPosition.length - 1]
            .position + 1
        )
        console.log("incremented nextHighestPosition:", nextHighestPosition)
      } else if (linkCollectionByPosition.length > initialAmountOfLinks) {
        console.log("link was added, but other condition was not met.")
        console.log("initialAmountOfLinks:", initialAmountOfLinks)
        console.log("amount of links now:", linkCollectionByPosition.length)
      }
    }
  }, [linkCollectionStatus, dispatch, linkCollectionByPosition])
  // TODO: dependency linkCollectionStatus not changing upon adding a link, it seems

  // to make sure links are always added at the end
  const [nextHighestPosition, setNextHighestPosition] = useState(0)

  // for debugging
  useEffect(() => {
    if (nextHighestPosition > 0) {
      console.log(
        `%c nextHighestPosition is set to: ${nextHighestPosition}`,
        "color: cyan;"
      )
      console.log(
        `%c position of last element is set to: ${
          linkCollectionByPosition[linkCollectionByPosition.length - 1].position
        }`,
        "color: cyan;"
      )
    }
  }, [nextHighestPosition])

  let contentOfLinkCollection = []
  if (linkCollectionStatus === "loading") {
    contentOfLinkCollection = <div>Loading...</div>
  } else if (linkCollectionStatus === "failed") {
    contentOfLinkCollection = <div>Error!</div>
  } else if (linkCollectionStatus === "succeeded") {
    switch (mode) {
      case "linked":
        contentOfLinkCollection = (
          <>
            <h2 className="section-title">{sectionTitle}</h2>
            <ClickableLinkCollection
              linkCollectionByPosition={linkCollectionByPosition}
            />
          </>
        )
        break

      case "draggable":
        contentOfLinkCollection = (
          <>
            <h2 className="section-title">{sectionTitle}</h2>
            <DraggableLinkCollection
              handle={handle}
              linkCollectionByPosition={linkCollectionByPosition}
            />
          </>
        )
        break

      case "editable":
        contentOfLinkCollection = (
          <>
            <div className="flex justify-between">
              <h2 className="section-title">{sectionTitle}</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-white text-black">
                    {"ADD"}
                  </Button>
                </DialogTrigger>
                <CreateLinkDialog
                  text={editableLinkText}
                  url={editableLinkUrl}
                  position={nextHighestPosition}
                  frontendId={nanoid()}
                  setAddRequestStatus={setAddRequestStatus}
                  onAddLinkClicked={onAddLinkClicked}
                />
              </Dialog>
            </div>

            <LinkCollectionProgressBar
              linkCollection={linkCollectionByPosition}
            />

            <CollectionOfEditableLinks
              linkCollectionByPosition={linkCollectionByPosition}
            />
          </>
        )
        break
    }
  }

  return <>{contentOfLinkCollection}</>
}

function ClickableLinkCollection({ linkCollectionByPosition }) {
  return linkCollectionByPosition.map((link) => {
    return (
      <a
        href={link.url}
        target="_blank"
        key={"pos-" + link.position + link.frontendId}
      >
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

function DraggableLinkCollection({ handle, linkCollectionByPosition }) {
  const [updateRequestStatus, setUpdateRequestStatus] = useState("idle")
  const dispatch = useDispatch()

  announce(
    "calibrating linkCollection for <DraggableLinkCollection/>",
    linkCollectionByPosition
  )

  // 'shawod copy' for dispatch on save
  const [reorderedLinkCollection, setReorderedLinkCollection] = useState([
    ...linkCollectionByPosition,
  ])

  // to cancel the update
  const { setLinkCollectionIsSortable } = useContext(ProfilePageContext)

  return (
    <>
      <p>Pick up a link to change its position in the collection.</p>
      <DndFrame
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
              setLinkCollectionIsSortable(false) // exit dnd-mode
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
              onSaveUpdateClicked()
              setLinkCollectionIsSortable(false) // exit dnd-mode
            }}
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
      const collectionWithRightPositions = reorderedLinkCollection.map(
        (linkNode, index) => {
          linkNode.position = index
          return linkNode
        }
      )
      announce(
        "sending reorderedLinkCollection to backend (updated positions):",
        collectionWithRightPositions
      )

      // createAsyncThunk only takes one argument
      const updateData = {
        handle,
        links: collectionWithRightPositions,
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

  // to trigger updrill if needed
  const [dragEventHandled, setDragEventHandled] = useState(null)

  // used for drag-and-drop (reorder and transition animation)
  const [linkNodes, setLinkNodes] = useState(
    linkCollectionByPosition.map((linkNode) => {
      console.log(
        "assigning linkNode.id based on frontendId",
        linkNode.frontendId
      )
      linkNode.id = linkNode.frontendId
      return linkNode
    })
  )

  // used to up-drill every time reorder happens
  useEffect(() => {
    // don't updrill on mount
    if (dragEventHandled) {
      // for debugging /.
      console.log(
        `%c dragEventHandled was touched: type=${typeof dragEventHandled}, value=${dragEventHandled}`,
        "color: cyan; font-weight: bold;"
      )
      announce("linkCollection within useEffect", linkCollectionByPosition)
      // for debugging ./

      setReorderedLinkCollection(linkNodes)
      setDragEventHandled(false)
    }
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
        {linkNodes.map((linkNode) => {
          console.log("round #" + counter + " id is: " + linkNode.id)
          counter++

          return (
            <SortableLinkNode
              key={linkNode.position}
              id={linkNode.frontendId}
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
        setDragEventHandled(true)

        return newlySortedItems
      })
    }
  }
}

function CollectionOfEditableLinks({ linkCollectionByPosition }) {
  // to trigger re-render in effect
  const [updateRequestStatus, setUpdateRequestStatus] = useState("idle")
  const [deleteLinkRequestStatus, setDeleteLinkRequestStatus] = useState("idle")

  // 'shadow copy' for dispatch
  const [linkNodes, setLinkNodes] = useState(
    linkCollectionByPosition.map((linkNode) => {
      return linkNode
    })
  )
  // TODO: only re-assign upon true action (not on mount)
  // used to up-drill every time reorder happens
  useEffect(() => {
    announce("linkCollectionByPosition", linkCollectionByPosition) // this is the updated one
    setLinkNodes(linkCollectionByPosition) // causes re-render after deletion
    announce("updateRequestStatus:", updateRequestStatus)
  }, [updateRequestStatus, deleteLinkRequestStatus, linkCollectionByPosition])

  return linkNodes.map((link) => {
    announce("link", link)

    return (
      <div key={"linkItem-" + link.position}>
        <div className="">
          <EditableLinkItem
            linkPosition={link.position}
            linkUrl={link.url}
            linkText={link.text}
            setUpdateRequestStatus={setUpdateRequestStatus}
            onSaveUpdatedLinkClicked={onSaveUpdatedLinkClicked}
            setDeleteLinkRequestStatus={setDeleteLinkRequestStatus}
            frontendId={link.frontendId}
          />
        </div>
      </div>
    )
  })
}

// Network and State-Management functions /.
async function onAddLinkClicked(
  handle,
  newLink,
  setAddRequestStatus,
  dispatch
) {
  try {
    setAddRequestStatus("pending")

    // createAsyncThunk only takes one argument
    const addData = {
      handle,
      newLink,
    }

    dispatch(addNewLink(addData))
  } catch (error) {
    console.error("Failed to add link: ", error)
  } finally {
    setAddRequestStatus("idle")
  }
}

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
    announce("updateData to dispatch", updateData)

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
  frontendId,
}) {
  return (
    <div
      key={"pos-" + linkPosition + frontendId + "-editable"}
      className="group/edit flex my-4"
    >
      <div className="w-full bg-konkikyou-blue py-2 px-3 mx-2">
        <LinkDisplay
          linkPosition={linkPosition}
          linkUrl={linkUrl}
          linkText={linkText}
          frontendId={frontendId}
        />
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="bg-konkikyou-blue pt-2 px-4">
            <PenIconButton />
          </div>
        </DialogTrigger>
        <EditLinkDialog
          text={linkText}
          url={linkUrl}
          position={linkPosition}
          frontendId={frontendId}
          setUpdateRequestStatus={setUpdateRequestStatus}
          onSaveUpdatedLinkClicked={onSaveUpdatedLinkClicked}
        />
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <div className="bg-konkikyou-blue mx-2 py-2 px-4">
            <DeleteCrossIconButton />
          </div>
        </DialogTrigger>
        <DeleteLinkDialog
          frontendId={frontendId}
          setDeleteLinkRequestStatus={setDeleteLinkRequestStatus}
        />
      </Dialog>
    </div>
  )
}

// Dialog for adding a link
function CreateLinkDialog({
  text,
  url,
  position,
  frontendId,
  setAddRequestStatus,
  onAddLinkClicked,
}) {
  // component-internal state
  const [linkText, setLinkText] = useState(text)
  const [linkUrl, setLinkUrl] = useState(url)
  const linkPosition = position

  // used for network and Redux state-management
  const dispatch = useDispatch()

  // reading from context
  const { handle } = useContext(ProfilePageContext)

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add Link</DialogTitle>
        <DialogDescription>
          Define your link here. Click save when you're done.
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
            onClick={() => {
              onAddLinkClicked(
                handle,
                {
                  frontendId: frontendId,
                  url: linkUrl,
                  text: linkText,
                  position: linkPosition,
                },
                setAddRequestStatus,
                dispatch
              )
              setLinkText("")
              setLinkUrl("")
            }}
          >
            Save changes
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

// Dialog to update a link
function EditLinkDialog({
  text,
  url,
  position,
  frontendId,
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

  // this is why it can display the wrong text if mixed up position values
  // update view independent of the backend
  useEffect(() => {
    announce("value changed -> linkText", linkText)
    let element = document.getElementById(
      "linkText-" + linkPosition + frontendId
    )
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
                  frontendId: frontendId,
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
function DeleteLinkDialog({ frontendId, setDeleteLinkRequestStatus }) {
  // Hooks can only be called inside of the body of a function component.
  const { handle } = useContext(ProfilePageContext)

  // used for network and Redux state-management
  const dispatch = useDispatch()

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
                frontendId,
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
  frontendId,
  handle,
  dispatch,
  setDeleteLinkRequestStatus
) {
  console.log(
    `%c onDeleteLinkClicked for link with frontendId '${frontendId}', handle '${handle}'`,
    "color:green;font-size:1.5em;"
  )

  try {
    setDeleteLinkRequestStatus("pending")

    // createAsyncThunk only takes one argument
    const deletionData = {
      handle,
      frontendId,
    }

    dispatch(deleteLink(deletionData))
  } catch (error) {
    console.error("Failed to delete link: ", error)
  } finally {
    setDeleteLinkRequestStatus("idle")
  }
}

function LinkDisplay({ linkPosition, linkUrl, linkText, frontendId }) {
  // announce("LinkDisplay", { linkPosition, linkUrl, linkText })
  return (
    <>
      <a>
        <IconMapper url={linkUrl} />
        <span id={"linkText-" + linkPosition + frontendId} className="mx-2">
          {linkText.length > 0 ? linkText : linkUrl}
        </span>
      </a>
    </>
  )
}

// UI interactions ./

// UI information /.
function LinkCollectionProgressBar({ linkCollection }) {
  let progress = (linkCollection.length / 12) * 100

  return (
    <>
      <span>
        You are listing {linkCollection.length} links of 12 possible links
      </span>
      <Progress
        id="linkCollectionProgressBar"
        value={progress}
        className="w-[60%] my-4"
      />
    </>
  )
}
// UI information ./
