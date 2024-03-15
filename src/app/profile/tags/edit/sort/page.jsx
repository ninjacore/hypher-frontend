"use client"
import React, { useState, useId } from "react"
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

import { SortableItem } from "./SortableItem"

import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <>
      <h2 className="text-xl font-bold mx-1 mt-2 mb-4">Sort Your Tags</h2>
      <DnD />
      <a href="/profile/tags/edit">
        <Button
          id="cancelReorderButton"
          variant="outline"
          className="bg-white text-black"
        >
          CANCEL
        </Button>
      </a>

      <Button
        id="saveReorderedTagsButton"
        variant="outline"
        className="bg-white text-black"
      >
        SAVE
      </Button>
    </>
  )
}

export function DnD() {
  const [items, setItems] = useState([1, 2, 3, 4])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const uniqueId = useId()

  let counter = 0

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      id={uniqueId}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id) => {
          // id = useId()
          console.log("round #" + counter + " id is: " + id)
          // let betterId = "DndDescribedBy-" + counter
          counter++

          return <SortableItem key={id} id={id} />
        })}
      </SortableContext>
    </DndContext>
  )

  function handleDragEnd(event) {
    const { active, over } = event

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }
}
