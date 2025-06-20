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
import {
  fetchFeaturedContent,
  updateFeaturedContentEntries,
  addNewFeaturedContent,
  updateSingleContentEntry,
  deleteSingleContentEntry,
} from "@/lib/features/profilePage/featuredContentSlice"

// imports for sorting functionality /.
import { SortableFeaturedContentNode } from "@/lib/utils/dragAndDropNodes/SortableFeaturedContentNode"
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
import { title } from "process"

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
  const mutableFeaturedContent = JSON.parse(JSON.stringify(featuredContent))

  // TODO: find the obsolete part
  // "there's something wrong, I can feel it" /.
  // to make sure content is always added at the end
  let initialLastPosition = null
  let initialAmountOfFeaturedContent = 0
  if (mutableFeaturedContent.length > 0) {
    initialLastPosition =
      mutableFeaturedContent[mutableFeaturedContent.length - 1].position
    initialAmountOfFeaturedContent = mutableFeaturedContent.length
  }

  // to make sure links are always added at the end
  const [nextHighestPosition, setNextHighestPosition] = useState(0)

  // "there's something wrong, I can feel it" ./

  announce("TOP LEVEL mutableLinkCollection", mutableFeaturedContent)

  useEffect(() => {
    if (featuredContentStatus === "idle") {
      dispatch(fetchFeaturedContent(handle))
    }

    // if content was added we need to update the nextHighestPosition
    checkNextHighestPosition(
      initialAmountOfFeaturedContent,
      initialLastPosition,
      mutableFeaturedContent,
      nextHighestPosition,
      setNextHighestPosition
    )

    // de-activate 'change order' button if there's not more than 1 featured content
    checkChangeOrderButton(mutableFeaturedContent)
  }, [featuredContentStatus, dispatch, mutableFeaturedContent])

  // duplicate of the above
  // useEffect(() => {
  //   if (mutableFeaturedContent.length > 0) {
  //     // if content was added we need to update the nextHighestPosition
  //     checkNextHighestPosition(
  //       initialAmountOfFeaturedContent,
  //       initialLastPosition,
  //       mutableFeaturedContent,
  //       nextHighestPosition,
  //       setNextHighestPosition
  //     )
  //   }
  // }, [mutableFeaturedContent, dispatch, featuredContentStatus])

  // for debugging
  useEffect(() => {
    if (nextHighestPosition > 0) {
      console.log(
        `%c [featuredContent] nextHighestPosition is set to: ${nextHighestPosition}`,
        "color: cyan;"
      )
      console.log(
        `%c [featuredContent] position of last element is set to: ${
          mutableFeaturedContent[mutableFeaturedContent.length - 1].position
        }`,
        "color: cyan;"
      )
    }
  }, [nextHighestPosition])

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
          mutableLinkCollection={mutableFeaturedContent}
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
            handle={handle}
            mutableFeaturedContent={mutableFeaturedContent}
            setFeaturedContentIsSortable={setFeaturedContentIsSortable}
          />
        </>
      )
    }

    return (
      <>
        {/* <h2 className="section-title">{sectionTitle}</h2> */}
        <EditableFeaturedContent
          handle={handle}
          mutableFeaturedContent={mutableFeaturedContent}
          sectionTitle={sectionTitle}
          nextHighestPosition={nextHighestPosition}
          setAddRequestStatus={setAddRequestStatus}
        />
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

function ClickableFeaturedContent({ mutableLinkCollection }) {
  return mutableLinkCollection.map((content) => {
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
                  : content.url.substring(0, 26) + "..."}
              </span>
            </div>
          </div>
        </a>
      </Card>
    )
  })
}

function EditableFeaturedContent({
  handle,
  mutableFeaturedContent,
  sectionTitle,
  nextHighestPosition,
  setAddRequestStatus,
}) {
  let editableTitle = ""
  let editableDescription = ""
  let editableUrl = ""
  let editableCategory = ""

  return (
    <>
      <div className="flex justify-between">
        <h2 className="section-title">{"Manage " + sectionTitle}</h2>

        <Dialog>
          <AddContentButton
            amountOfContent={mutableFeaturedContent.length}
            maxAmountOfContent={6}
          />
          <CreateContentDialog
            title={editableTitle}
            description={editableDescription}
            url={editableUrl}
            category={editableCategory}
            position={nextHighestPosition}
            frontendId={nanoid()}
            setAddRequestStatus={setAddRequestStatus}
            onAddContentClicked={onAddContentClicked}
          />
        </Dialog>
      </div>

      <FeaturedContentProgressBar featuredContent={mutableFeaturedContent} />

      <CollectionOfFeaturedContent
        mutableFeaturedContent={mutableFeaturedContent}
      />
    </>
  )
}

function DraggableFeaturedContent({
  handle,
  mutableFeaturedContent,
  setFeaturedContentIsSortable,
}) {
  const [updateRequestStatus, setUpdateRequestStatus] = useState("idle")
  const dispatch = useDispatch()

  // 'shadow copy' for dispatch on save
  const [reorderedFeaturedContent, setReorderedFeaturedContent] = useState([
    ...mutableFeaturedContent,
  ])

  return (
    <>
      <p>Pick up a link to change its position in the collection.</p>
      <DndFrame
        mutableFeaturedContent={mutableFeaturedContent}
        setReorderedFeaturedContent={setReorderedFeaturedContent}
      />
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
              onSaveUpdateClicked(
                handle,
                reorderedFeaturedContent,
                setUpdateRequestStatus,
                dispatch
              )
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

// status support functions /.
function checkNextHighestPosition(
  initialAmountOfFeaturedContent,
  initialLastPosition,
  mutableFeaturedContent,
  nextHighestPosition,
  setNextHighestPosition
) {
  // // cover the case when there's no content
  // if (!mutableFeaturedContent.length > 0) {
  //   setNextHighestPosition(0)
  // }

  // needs to reflect positions as they were initially given by the backend
  setNextHighestPosition(initialLastPosition + 1)

  try {
    // if content was added we need to update the nextHighestPosition
    if (
      mutableFeaturedContent.length > initialAmountOfFeaturedContent ||
      mutableFeaturedContent[mutableFeaturedContent.length - 1].position !==
        initialLastPosition
    ) {
      // set to true last position + 1
      setNextHighestPosition(
        mutableFeaturedContent[mutableFeaturedContent.length - 1].position + 1
      )
      console.log(
        "[FeaturedContent] incremented nextHighestPosition:",
        nextHighestPosition
      )
    }
  } catch (error) {
    console.error("checkNextHighestPosition error:", error)
  }
}

function checkChangeOrderButton(mutableLinkCollection) {
  if (mutableLinkCollection.length < 2) {
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
// status support functions ./

// manage content support functions /.
function CollectionOfFeaturedContent({ mutableFeaturedContent }) {
  // to trigger re-render in effect
  const [updateRequestStatus, setUpdateRequestStatus] = useState("idle")
  const [deleteRequestStatus, setDeleteRequestStatus] = useState("idle")

  // 'shadow copy' for dispatch
  const [contentNodes, setContentNodes] = useState(
    mutableFeaturedContent.map((featuredNode) => {
      featuredNode.id = featuredNode.frontendId
      return featuredNode
    })
  )

  // up-drill every time change happens
  useEffect(() => {
    announce("mutableFeaturedContent", mutableFeaturedContent)
    setContentNodes(mutableFeaturedContent) // causes re-render after deletion
    announce("updateRequestStatus", updateRequestStatus)
  }, [updateRequestStatus, deleteRequestStatus, mutableFeaturedContent])

  return contentNodes.map((contentNode) => {
    announce("featuredContent:", contentNode)

    return (
      <EditableFeaturedContentItem
        key={contentNode.frontendId}
        contentPosition={contentNode.position}
        contentTitle={contentNode.title}
        contentDescription={contentNode.description}
        contentUrl={contentNode.url}
        contentCategory={contentNode.category}
        frontendId={contentNode.frontendId}
        setUpdateRequestStatus={setUpdateRequestStatus}
        setDeleteRequestStatus={setDeleteRequestStatus}
      />
    )
  })
}

function EditableFeaturedContentItem({
  contentPosition,
  contentTitle,
  contentDescription,
  contentUrl,
  contentCategory,
  frontendId,
  setUpdateRequestStatus,
  setDeleteRequestStatus,
}) {
  return (
    <Card
      key={contentCategory + contentPosition + "non-linked"}
      className="bg-midnight-blue"
    >
      <div className="flex my-4 pl-2.5 text-white bg-konkikyou-blue rounded-none">
        <FeaturedContentDisplay
          contentPosition={contentPosition}
          contentTitle={contentTitle}
          contentDescription={contentDescription}
          contentUrl={contentUrl}
          contentCategory={contentCategory}
        />

        <div className="flex-col bg-midnight-blue pl-2">
          <div className="flex">
            <Dialog>
              <DialogTrigger asChild>
                <div className="bg-konkikyou-blue pt-2 px-4">
                  <PenIconButton />
                </div>
              </DialogTrigger>
              <EditContentDialog
                title={contentTitle}
                description={contentDescription}
                url={contentUrl}
                category={contentCategory}
                position={contentPosition}
                frontendId={frontendId}
                setUpdateRequestStatus={setUpdateRequestStatus}
                onSaveUpdatedContentClicked={onSaveUpdatedContentClicked}
              />
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <div className="bg-konkikyou-blue mx-2 py-2 px-4">
                  <DeleteCrossIconButton />
                </div>
              </DialogTrigger>
              <DeleteContentDialog
                frontendId={frontendId}
                setDeleteRequestStatus={setDeleteRequestStatus}
              />
            </Dialog>
          </div>
          <div>{/* just here for formatting */}</div>
        </div>
      </div>
    </Card>
  )
}

function FeaturedContentDisplay({
  contentPosition,
  contentTitle,
  contentDescription,
  contentUrl,
  contentCategory,
}) {
  return (
    <>
      <div className="text-5xl py-4 px-2">
        <IconMapper url={contentCategory + ":"} />
      </div>
      <div className="grow p-2">
        <span>{contentTitle.length > 0 ? contentTitle : ""}</span>
        <br />
        <span>
          {contentDescription.length > 0
            ? contentDescription
            : contentUrl.substring(0, 26) + "..."}
        </span>
      </div>
    </>
  )
}

function AddContentButton({ amountOfContent, maxAmountOfContent }) {
  if (amountOfContent >= maxAmountOfContent) {
    // inactive mode
    return (
      <Button variant="outline" className="bg-white text-black" disabled>
        add
      </Button>
    )
  }

  // active mode
  return (
    <DialogTrigger asChild>
      <Button variant="outline" className="bg-white text-black">
        add
      </Button>
    </DialogTrigger>
  )
}

function FeaturedContentProgressBar({ featuredContent }) {
  let progress = (featuredContent.length / 6) * 100

  return (
    <>
      <span>
        You are listing {featuredContent.length} out of 6 possible content items
      </span>
      <Progress
        id="featuredContentProgressBar"
        value={progress}
        className="w-[60%] my-4"
      />
    </>
  )
}

function CreateContentDialog({
  title,
  description,
  url,
  category,
  position,
  frontendId,
  setAddRequestStatus,
  onAddContentClicked,
}) {
  // component-internal state
  const [contentTitle, setContentTitle] = useState(title)
  const [contentDescription, setContentDescription] = useState(description)
  const [contentUrl, setContentUrl] = useState(url)
  const [contentCategory, setContentCategory] = useState(category)
  const contentPosition = position

  // used for network and Redux state-management
  const dispatch = useDispatch()

  // TODO: check if this costs performance
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
          <Label htmlFor="contentTitle" className="text-right">
            Title
          </Label>
          <Input
            id={"contentTitleInput-" + contentPosition}
            type="text"
            className="col-span-3"
            value={contentTitle}
            onChange={(e) => setContentTitle(e.target.value)}
          />
          <Label htmlFor="contentDescription" className="text-right">
            Description
          </Label>
          <Input
            id={"contentDescriptionInput-" + contentPosition}
            type="text"
            className="col-span-3"
            value={contentDescription}
            onChange={(e) => setContentDescription(e.target.value)}
          />
          <Label htmlFor="contentUrl" className="text-right">
            Url
          </Label>
          <Input
            id={"contentUrlInput-" + contentPosition}
            type="text"
            className="col-span-3"
            value={contentUrl}
            onChange={(e) => setContentUrl(e.target.value)}
          />
          <Label htmlFor="contentCategory" className="text-right">
            Category
          </Label>
          <Input
            id={"contentCategoryInput-" + contentPosition}
            type="text"
            className="col-span-3"
            value={contentCategory}
            onChange={(e) => setContentCategory(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose>
          <div className="flex justify-end gap-5">
            <Button
              className="bg-white text-black"
              variant="outline"
              type="reset"
              onClick={() => {
                setContentTitle("")
                setContentDescription("")
                setContentUrl("")
                setContentCategory("")
              }}
            >
              cancel
            </Button>
            <Button
              className="bg-white text-black"
              variant="outline"
              type="submit"
              onClick={() => {
                onAddContentClicked(
                  handle,
                  {
                    frontendId: frontendId,
                    title: contentTitle,
                    description: contentDescription,
                    url: contentUrl,
                    category: contentCategory,
                    position: contentPosition,
                  },
                  setAddRequestStatus,
                  dispatch
                )
                setContentTitle("")
                setContentDescription("")
                setContentUrl("")
                setContentCategory("")
              }}
            >
              save
            </Button>
          </div>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

function EditContentDialog({
  title,
  description,
  url,
  category,
  position,
  frontendId,
  setUpdateRequestStatus,
  onSaveUpdatedContentClicked,
}) {
  // component-internal state
  const [contentTitle, setContentTitle] = useState(title)
  const [contentDescription, setContentDescription] = useState(description)
  const [contentUrl, setContentUrl] = useState(url)
  const [contentCategory, setContentCategory] = useState(category)
  const contentPosition = position

  // used for network and Redux state-management
  const dispatch = useDispatch()

  // reading from context
  const { handle } = useContext(ProfilePageContext)

  // this is why it can display the wrong text if mixed up position values
  // TODO: update view independent of the backend
  // useEffect(() => {}

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Content</DialogTitle>
        <DialogDescription>
          Change your content here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="contentTitle" className="text-right">
            Title
          </Label>
          <Input
            id={"contentTitleInput-" + contentPosition}
            type="text"
            className="col-span-3"
            value={contentTitle}
            onChange={(e) => setContentTitle(e.target.value)}
          />
          <Label htmlFor="contentDescription" className="text-right">
            Description
          </Label>
          <Input
            id={"contentDescriptionInput-" + contentPosition}
            type="text"
            className="col-span-3"
            value={contentDescription}
            onChange={(e) => setContentDescription(e.target.value)}
          />
          <Label htmlFor="contentUrl" className="text-right">
            Url
          </Label>
          <Input
            id={"contentUrlInput-" + contentPosition}
            type="text"
            className="col-span-3"
            value={contentUrl}
            onChange={(e) => setContentUrl(e.target.value)}
          />
          <Label htmlFor="contentCategory" className="text-right">
            Category
          </Label>
          <Input
            id={"contentCategoryInput-" + contentPosition}
            type="text"
            className="col-span-3"
            value={contentCategory}
            onChange={(e) => setContentCategory(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose>
          <div className="flex justify-end gap-5">
            <Button
              className="bg-white text-black"
              variant="outline"
              type="reset"
              onClick={() => {
                setContentTitle(title)
                setContentDescription(description)
                setContentUrl(url)
                setContentCategory(category)
              }}
            >
              cancel
            </Button>

            <Button
              className="bg-white text-black"
              variant="outline"
              type="submit"
              onClick={() =>
                onSaveUpdatedContentClicked(
                  handle,
                  {
                    frontendId: frontendId,
                    title: contentTitle,
                    description: contentDescription,
                    url: contentUrl,
                    category: contentCategory,
                    position: contentPosition,
                  },
                  setUpdateRequestStatus,
                  dispatch
                )
              }
            >
              save
            </Button>
          </div>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

function DeleteContentDialog({ frontendId, setDeleteRequestStatus }) {
  // Hooks can only be called inside of the body of a function component.
  const { handle } = useContext(ProfilePageContext)

  // used for network and Redux state-management
  const dispatch = useDispatch()

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Delete Content</DialogTitle>
        <DialogDescription>
          Are you sure you want to stop featuring this content?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose>
          <div className="flex justify-end gap-2">
            <Button
              className="bg-white text-black"
              variant="outline"
              type="submit"
              id="confirmContentDeletion-Button"
              onClick={() =>
                onDeleteContentClicked(
                  frontendId,
                  handle,
                  dispatch,
                  setDeleteRequestStatus
                )
              }
            >
              yes
            </Button>
            <Button
              className="bg-white text-black"
              variant="outline"
              type="reset"
              id="cancelContentDeletion-Button"
            >
              no
            </Button>
          </div>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
// manage content support functions ./

// drag-and-drop support functions /.
function DndFrame({ mutableFeaturedContent, setReorderedFeaturedContent }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // to trigger updrill if needed
  const [dragEventHandled, setDragEventHandled] = useState(null)

  // used for drag-and-drop (reorder and transition animation)
  const [featuredContentNodes, setFeaturedContentNodes] = useState(
    mutableFeaturedContent.map((featuredNode) => {
      console.log(
        "assigning featuredNode.id based on frontendId",
        featuredNode.frontendId
      )
      announce("featuredNode", featuredNode)

      featuredNode.id = featuredNode.frontendId
      return featuredNode
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
      announce("featuredContent within useEffect", mutableFeaturedContent)
      // for debugging ./

      setReorderedFeaturedContent(featuredContentNodes)
      setDragEventHandled(false)
    }
  }, [featuredContentNodes])

  // for debugging
  let counter = 0

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      id={useId()}
    >
      <SortableContext
        items={featuredContentNodes}
        strategy={verticalListSortingStrategy}
      >
        {featuredContentNodes.map((contentNode) => {
          console.log("round #" + counter + " id is: " + contentNode.id)
          counter++

          return (
            <SortableFeaturedContentNode
              key={contentNode.position}
              id={contentNode.id}
              title={contentNode.title}
              description={contentNode.description}
              url={contentNode.url}
              category={contentNode.category}
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
      setFeaturedContentNodes((items) => {
        const oldIndex = items
          .map((featuredNode) => featuredNode.id)
          .indexOf(active.id)

        const newIndex = items
          .map((featuredNode) => featuredNode.id)
          .indexOf(over.id)

        // swap positions (including the 'position' attribute)
        const newlySortedItems = arrayMove(items, oldIndex, newIndex)
        newlySortedItems.forEach((featuredNode, index) => {
          featuredNode.position = index
        })
        setDragEventHandled(true)

        return newlySortedItems
      })
    }
  }
}
// drag-and-drop support functions ./

// Network and State-Management functions /.
async function onAddContentClicked(
  handle,
  newContent,
  setAddRequestStatus,
  dispatch
) {
  try {
    setAddRequestStatus("pending")

    // createAsayncThunk only takes one argument
    const addData = {
      handle,
      content: newContent,
    }

    dispatch(addNewFeaturedContent(addData))
  } catch (error) {
    console.error("Failed to add content: ", error)
  } finally {
    setAddRequestStatus("idle")
  }
}

async function onSaveUpdateClicked(
  handle,
  bufferedFeaturedContentCollection,
  setUpdateRequestStatus,
  dispatch
) {
  try {
    setUpdateRequestStatus("pending")
    announce(
      "sending reorderedFeaturedContent to backend (default positions):",
      bufferedFeaturedContentCollection
    )
    const collectionWithRightPositions = bufferedFeaturedContentCollection.map(
      (featuredNode, index) => {
        featuredNode.position = index
        return featuredNode
      }
    )
    announce(
      "sending reorderedFeaturedContent to backend (updated positions):",
      collectionWithRightPositions
    )

    // createAsyncThunk only takes one argument
    const updateData = {
      handle,
      content: collectionWithRightPositions,
    }
    dispatch(updateFeaturedContentEntries(updateData))
  } catch (error) {
    console.error(
      "[onSaveUpdateClicked] Failed to save the featured content to the collection:",
      error
    )
  } finally {
    setUpdateRequestStatus("idle")
  }
}

async function onSaveUpdatedContentClicked(
  handle,
  updatedContent,
  setUpdateRequestStatus,
  dispatch
) {
  try {
    setUpdateRequestStatus("pending")

    // createAsyncThunk only takes one argument
    const updateData = {
      handle,
      content: updatedContent,
    }
    announce("[featuredContent] updateData to dispatch", updateData)

    dispatch(updateSingleContentEntry(updateData))
  } catch (error) {
    console.error("Failed to update content: ", error)
  } finally {
    setUpdateRequestStatus("idle")
  }
}

async function onDeleteContentClicked(
  frontendId,
  handle,
  dispatch,
  setDeleteRequestStatus
) {
  try {
    setDeleteRequestStatus("pending")

    // createAsyncThunk only takes one argument
    const deleteData = {
      handle,
      frontendId,
    }
    dispatch(deleteSingleContentEntry(deleteData))
  } catch (error) {
    console.error("Failed to delete content: ", error)
  } finally {
    setDeleteRequestStatus("idle")
  }
}

// Network and State-Management functions ./
