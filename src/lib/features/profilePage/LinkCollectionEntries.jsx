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

import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { nanoid } from "@reduxjs/toolkit"

// to read data from the Redux store
import { useSelector } from "react-redux"

// specific CRUD actions for this feature
import {
  fetchLinkCollection,
  addNewLink,
  updateLink,
  deleteLink,
} from "@/lib/features/profilePage/linkCollectionSlice"

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
    contentOfLinkCollection = links.map((link) => {
      switch (mode) {
        case "linked":
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

        case "editable":
          return <></>

        case "ineditable":
          return <></>

        default:
          return <>link mode not covered.</>
      }
    })
  }

  return (
    <>
      <b>LET'S CONNECT | Links via Redux V2</b>
      {/* {links.map((link) => updatableLink(link))} */}
      {/* {renderedLinkCollection} */}
      {contentOfLinkCollection}
      {/* <AddLinkSection /> */}
    </>
  )
}
