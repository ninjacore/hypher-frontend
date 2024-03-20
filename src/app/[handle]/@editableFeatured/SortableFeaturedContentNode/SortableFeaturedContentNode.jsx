"use client "

import React from "react"
import { useSortable } from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities"
import { IconMapper } from "../../../../components/iconMapper"

import { Card } from "@/components/ui/card"

function SortableFeaturedContentNode(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id })
  // The argument passed to the id argument of useSortable should match
  // the id passed in the items array of the parent SortableContext provider.

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  console.log("SortableFeaturedContentNode::props")
  console.table(props)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className=""
    >
      {/* <span className="">{props.text + " :: " + props.url}</span> */}
      {/* <div
        key={"pos-" + props.position}
        className="my-4 mx-2 py-2 px-3 bg-konkikyou-blue"
      >
        <IconMapper url={props.url} />
        <span className="mx-2">
          {props.title.length > 0 ? props.title : props.url}
        </span>
      </div> */}
      <Card key={props.category + props.position} className="my-4">
        <div className="flex">
          <div className="text-5xl py-4 px-2">
            <IconMapper url={props.category + ":"} />
          </div>
          <div className="grow p-2">
            <span>{props.title.length > 0 ? props.title : ""}</span>
            <br />
            <span>
              {props.description.length > 0 ? props.description : props.url}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export { SortableFeaturedContentNode }
