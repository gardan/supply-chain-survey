"use client"

import { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useSurvey, type PriorityItem } from "@/lib/survey-context"

function SortableSlot({
  id,
  index,
  item,
  onRemove,
}: {
  id: string
  index: number
  item: PriorityItem | null
  onRemove: (processId: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id, disabled: !item })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  if (!item) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex h-9 w-28 flex-shrink-0 items-center justify-center rounded-md border border-dashed border-navy/25 lg:w-36"
      >
        <span className="text-xs text-navy/30">
          {"+ "}{index + 1}
        </span>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative flex h-9 w-28 flex-shrink-0 cursor-grab items-center rounded-md bg-amber px-2 active:cursor-grabbing lg:w-36"
    >
      <span className="mr-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-cream">
        {index + 1}
      </span>
      <span className="truncate text-[11px] font-medium text-navy">
        {item.process.name}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove(item.process.id)
        }}
        className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-navy text-[9px] text-cream opacity-0 transition-opacity group-hover:opacity-100"
        aria-label={`Remove ${item.process.name}`}
      >
        x
      </button>
    </div>
  )
}

export function PriorityBar() {
  const { state, dispatch, filledCount } = useSurvey()
  const { priorities } = state
  const showSubmit = filledCount === 5 && state.appState !== "submit"

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const slotIds = useMemo(
    () => priorities.map((_, i) => `slot-${i}`),
    [priorities]
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = slotIds.indexOf(active.id as string)
    const newIndex = slotIds.indexOf(over.id as string)

    const newPriorities = [...priorities]
    const [moved] = newPriorities.splice(oldIndex, 1)
    newPriorities.splice(newIndex, 0, moved)

    dispatch({ type: "REORDER_PRIORITIES", payload: newPriorities })
  }

  function handleRemove(processId: string) {
    dispatch({ type: "REMOVE_PRIORITY", payload: processId })
  }

  function handleSubmitClick() {
    dispatch({ type: "SET_STATE", payload: "submit" })
  }

  return (
    <div className="flex items-center gap-3">
      <span
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color: "#1e3a5f" }}
      >
        Top 5 Challenges
      </span>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={slotIds} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-1.5">
            {priorities.map((item, index) => (
              <SortableSlot
                key={slotIds[index]}
                id={slotIds[index]}
                index={index}
                item={item}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <AnimatePresence>
        {showSubmit && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={handleSubmitClick}
            className="animate-pulse-amber h-9 flex-shrink-0 rounded-md px-4 text-xs font-bold uppercase tracking-wide transition-colors"
            style={{ backgroundColor: "#f59e0b", color: "#1e3a5f" }}
          >
            Submit
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
