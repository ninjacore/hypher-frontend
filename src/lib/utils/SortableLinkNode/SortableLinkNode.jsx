"use client "

import React from "react"
import { useSortable } from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities"
import { IconMapper } from "@/components/iconMapper"

function SortableLinkNode(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id })
  // The argument passed to the id argument of useSortable should match
  // the id passed in the 'items' prop of SortableContext.

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
      <div
        key={"pos-" + props.position}
        className="my-4 mx-2 py-2 px-3 bg-konkikyou-blue"
      >
        <IconMapper url={props.url} key={"icon-" + props.id} />
        <span className="mx-2" key={"contentOf-" + props.id}>
          {props.text.length > 0 ? props.text : props.url}
        </span>
      </div>
    </div>
  )
}

export { SortableLinkNode }
