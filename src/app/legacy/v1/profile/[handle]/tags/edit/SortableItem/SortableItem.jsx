"use client "

import React from "react"
import { useSortable } from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities"

function SortableItem(props) {
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
      className="flex mx-1.5 my-1 px-3 py-0.45 rounded text-sm font-medium bg-white text-black w-fit my-2"
    >
      <span className="">{props.text}</span>
    </div>
  )
}

export { SortableItem }
