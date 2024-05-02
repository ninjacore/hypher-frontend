"use client"
// since we are using 'useState' and 'useEffect'
import React, { useEffect, useState, useId, useContext } from "react"
import { useDispatch } from "react-redux"

// to update the interactability status
import { ProfilePageContext } from "@/app/[handle]/utils/ProfilePageContext"

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

function EditableLinkItem({
  linkPosition,
  linkUrl,
  linkText,
  setUpdateRequestStatus,
  onSaveUpdatedLinkClicked,
}) {
  return (
    <>
      {/* <div
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
        <div className="bg-konkikyou-blue">
          <PenIconButton />
        </div>
        <div className="bg-konkikyou-blue mx-2">
          <DeleteCrossIconButton />
        </div>
      </div> */}

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
          <EditableLinkInput
            text={linkText}
            url={linkUrl}
            position={linkPosition}
            setUpdateRequestStatus={setUpdateRequestStatus}
            onSaveUpdatedLinkClicked={onSaveUpdatedLinkClicked}
          />
        </Dialog>

        <div className="bg-konkikyou-blue mx-2">
          <DeleteCrossIconButton />
        </div>
      </div>
    </>
  )
}

function EditableLinkInput({
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

export { EditableLinkItem }
