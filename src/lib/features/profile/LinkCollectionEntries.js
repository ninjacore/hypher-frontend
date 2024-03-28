"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { nanoid } from "@reduxjs/toolkit"

// to read data from the Redux store
import { useSelector } from "react-redux"

// to save data to the Redux store
import { addLink } from "@/lib/features/profile/linkCollectionSlice"

export const LinkCollectionEntries = () => {
  // useSelector is a hook that allows you to extract data from the Redux store state
  const links = useSelector((state) => state.linkCollection.links)

  return (
    <>
      <h2>Links via Redux</h2>
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <a href={link.url}>{link.name}</a>
          </li>
        ))}
      </ul>
      <AddLinkSection />
    </>
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
          name: linkText,
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
          type="text"
          className="col-span-3"
          value={linkUrl}
          onChange={onLinkUrlChange}
        />
      </div>
      <Button onClick={onSaveLinkClicked}>Save Link</Button>
    </div>
  )
}
