"use client"

// imports for UI /.
import { IconMapper } from "../../../components/iconMapper"
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

import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { nanoid } from "@reduxjs/toolkit"

// to read data from the Redux store
import { useSelector } from "react-redux"

// to save data to the Redux store
import { addLink, updateLink } from "@/lib/features/profile/linkCollectionSlice"

export const LinkCollectionEntries = () => {
  // useSelector is a hook that allows you to extract data from the Redux store state
  const links = useSelector((state) => state.linkCollection.links)
  // to not cause 'too many rerenders' error
  const renderedLinkCollection = links.map((link) => {
    // non-editable link collection
    return (
      <div
        key={"pos-" + link.position}
        className="my-4 mx-2 py-2 px-3 bg-konkikyou-blue"
      >
        <a href={link.url} target="_blank">
          <IconMapper url={link.url} />
          <span className="mx-2">
            {link.text.length > 0 ? link.text : link.url}
          </span>
        </a>
      </div>
    )
  })

  return (
    <>
      <b>LET'S CONNECT | Links via Redux</b>
      {/* {links.map((link) => updatableLink(link))} */}
      {renderedLinkCollection}
      <AddLinkSection />
    </>
  )
}

function updatableLink(link) {
  const [linkText, setLinkText] = useState(link.text)
  const [linkUrl, setLinkUrl] = useState(link.url)

  const [linkTextBuffer, setLinkTextBuffer] = useState(link.text)
  const [linkUrlBuffer, setLinkUrlBuffer] = useState(link.url)

  const dispatch = useDispatch()

  const onLinkTextChange = (e) => setLinkTextBuffer(e.target.value)
  const onLinkUrlChange = (e) => setLinkUrlBuffer(e.target.value)

  const onUpdateLinkClicked = () => {
    if (linkTextBuffer && linkUrlBuffer) {
      dispatch(
        updateLink({
          id: nanoid(),
          text: linkTextBuffer,
          url: linkUrlBuffer,
          position: link.position,
        })
      )

      // TODO: reactivate once store is definitively working
      // // save from buffer to state
      // setLinkText(linkTextBuffer)
      // setLinkUrl(linkUrlBuffer)
    }
  }

  //   return (
  //     <li key={link.id}>
  //       <a href={linkUrl}>{linkText}</a>
  //     </li>
  //   )
  return (
    <div key={"linkItem-" + link.position}>
      <Dialog>
        <DialogTrigger asChild>
          <div className="group/edit">
            <div
              key={"pos-" + link.position + "-editable"}
              className="my-4 mx-2 py-0.5 px-3 bg-konkikyou-blue group/edit"
            >
              <a>
                <IconMapper url={linkUrl} />
                <span id={"linkText-" + link.position} className="mx-2">
                  {linkText.length > 0 ? linkText : linkUrl}
                </span>
              </a>
              <EditButton />
            </div>
          </div>
        </DialogTrigger>
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
                id={"linkTextInput-" + link.position}
                type="text"
                className="col-span-3"
                value={linkTextBuffer}
                onChange={onLinkTextChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="linkUrl" className="text-right">
                Link
              </Label>
              <Input
                id={"linkUrlInput-" + link.position}
                type="text"
                className="col-span-3"
                value={linkUrlBuffer}
                onChange={onLinkUrlChange}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <span type="submit" onClick={onUpdateLinkClicked}>
                Save changes
              </span>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AddLinkSection() {
  const [linkText, setLinkText] = useState("")
  const [linkUrl, setLinkUrl] = useState("")

  const dispatch = useDispatch()

  const onLinkTextChange = (e) => setLinkText(e.target.value)
  const onLinkUrlChange = (e) => setLinkUrl(e.target.value)

  const onSaveLinkClicked = () => {
    if (linkText && linkUrl) {
      dispatch(
        addLink({
          id: nanoid(),
          text: linkText,
          url: linkUrl,
          position: 0,
        })
      )
      setLinkText("")
      setLinkUrl("")
    }
  }

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="linkText" className="text-right">
          Text
        </Label>
        <Input
          //   id={"linkTextInput-" + link.position}
          id="linkTextInput"
          type="text"
          className="col-span-3"
          value={linkText}
          onChange={onLinkTextChange}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="linkUrl" className="text-right">
          Link
        </Label>
        <Input
          //   id={"linkUrlInput-" + link.position}
          id="linkUrlInput"
          type="text"
          className="col-span-3"
          value={linkUrl}
          onChange={onLinkUrlChange}
        />
      </div>
      <span onClick={onSaveLinkClicked}>Save Link</span>
    </div>
  )
}
