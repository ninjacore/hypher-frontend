"use client "

import React from "react"
import { useSortable } from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities"
import { IconMapper } from "@/components/iconMapper"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGripLines } from "@fortawesome/free-solid-svg-icons"

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className=""
    >
      <Card
        key={props.category + props.position}
        className="my-4 pl-2.5 text-white bg-konkikyou-blue rounded-none"
      >
        <div className="flex">
          <div className="text-5xl py-4 px-2">
            <IconMapper url={props.category + ":"} />
          </div>
          <div className="grow p-2">
            <span>{props.title.length > 0 ? props.title : ""}</span>
            <br />
            <span>
              {props.description.length > 0
                ? props.description
                : props.url.substring(0, 26) + "..."}
            </span>
          </div>
          <div className="py-6 px-8">
            <FontAwesomeIcon
              icon={faGripLines}
              className="fas fa-grip-lines text-base"
            ></FontAwesomeIcon>
          </div>
        </div>
      </Card>
    </div>
  )
}

export { SortableFeaturedContentNode }
