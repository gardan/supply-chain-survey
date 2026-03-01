"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Plus, X, Pencil } from "lucide-react"
import { useSurvey } from "@/lib/survey-context"
import { ZONES, type Process } from "@/lib/survey-data"
import { AcronymTooltip, getAcronyms } from "./acronym-tooltip"

function AddCustomProcessCard({ zoneName }: { zoneName: string }) {
  const { dispatch, filledCount } = useSurvey()
  const [isOpen, setIsOpen] = useState(false)
  const [customName, setCustomName] = useState("")
  const [showTooltip, setShowTooltip] = useState(false)
  const [shaking, setShaking] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!customName.trim()) return

    if (filledCount >= 5) {
      setShaking(true)
      setShowTooltip(true)
      setTimeout(() => setShaking(false), 500)
      setTimeout(() => setShowTooltip(false), 2000)
      return
    }

    const customProcess: Process = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: customName.trim(),
      description: "Custom challenge",
    }

    // Add to custom processes list
    dispatch({
      type: "ADD_CUSTOM_PROCESS",
      payload: { process: customProcess, zoneName },
    })

    // Also add to priorities
    dispatch({
      type: "ADD_PRIORITY",
      payload: { process: customProcess, zoneName },
    })

    setCustomName("")
    setIsOpen(false)
  }

  if (isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex h-full min-h-[120px] flex-col rounded-xl border p-4 backdrop-blur-sm"
        style={{
          borderColor: "#f59e0b",
          backgroundColor: "rgba(30,58,95,0.85)",
        }}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-2 top-2 rounded-full p-1 transition-colors hover:bg-white/10"
        >
          <X className="h-4 w-4 text-white/60" />
        </button>
        <h4 className="mb-3 text-sm font-semibold text-white">
          Add Your Own Challenge
        </h4>
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Describe your challenge..."
            className="flex-1 rounded-lg border bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 focus:border-amber focus:outline-none"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
            autoFocus
            maxLength={100}
          />
          <motion.button
            type="submit"
            animate={shaking ? { x: [0, -6, 6, -6, 6, 0] } : {}}
            transition={shaking ? { duration: 0.4 } : {}}
            disabled={!customName.trim()}
            className="mt-3 rounded-lg py-2 text-sm font-bold transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#f59e0b", color: "#1e3a5f" }}
          >
            Add Challenge
          </motion.button>
        </form>
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute -bottom-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded px-3 py-1 text-xs shadow-lg"
              style={{ backgroundColor: "#1e3a5f", color: "#faf7f2" }}
            >
              Remove one priority first
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <motion.button
      onClick={() => setIsOpen(true)}
      whileHover={{ scale: 1.03 }}
      className="flex h-full min-h-[120px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition-colors hover:border-amber hover:bg-white/5"
      style={{ borderColor: "rgba(255,255,255,0.3)" }}
    >
      <div
        className="mb-2 flex h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      >
        <Plus className="h-6 w-6 text-white/70" />
      </div>
      <span className="text-sm font-medium text-white/70">
        Add Your Own
      </span>
    </motion.button>
  )
}

function CustomProcessCard({
  process,
  zoneName,
}: {
  process: Process
  zoneName: string
}) {
  const { dispatch, isProcessSelected, getProcessRank, filledCount } = useSurvey()
  const selected = isProcessSelected(process.id)
  const rank = getProcessRank(process.id)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(process.name)
  const [shaking, setShaking] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  function handleClick() {
    if (isEditing) return
    if (selected) {
      dispatch({ type: "REMOVE_PRIORITY", payload: process.id })
    } else {
      if (filledCount >= 5) {
        setShaking(true)
        setShowTooltip(true)
        setTimeout(() => setShaking(false), 500)
        setTimeout(() => setShowTooltip(false), 2000)
        return
      }
      dispatch({
        type: "ADD_PRIORITY",
        payload: { process, zoneName },
      })
    }
  }

  function handleEditClick(e: React.MouseEvent) {
    e.stopPropagation()
    setIsEditing(true)
    setEditName(process.name)
  }

  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!editName.trim()) return
    dispatch({
      type: "UPDATE_CUSTOM_PROCESS",
      payload: { processId: process.id, name: editName.trim() },
    })
    setIsEditing(false)
  }

  function handleCancelEdit(e: React.MouseEvent) {
    e.stopPropagation()
    setIsEditing(false)
    setEditName(process.name)
  }

  return (
    <motion.div
      onClick={handleClick}
      animate={shaking ? { x: [0, -6, 6, -6, 6, 0] } : {}}
      transition={shaking ? { duration: 0.4 } : {}}
      whileHover={!isEditing ? { scale: 1.03 } : {}}
      className={`relative flex h-full w-full min-h-[120px] cursor-pointer flex-col rounded-xl border p-5 text-left transition-colors backdrop-blur-sm ${
        selected
          ? "shadow-[0_0_12px_rgba(168,85,247,0.3)]"
          : "hover:shadow-[0_0_12px_rgba(168,85,247,0.2)]"
      }`}
      style={{
        borderColor: selected ? "#a855f7" : "rgba(168,85,247,0.5)",
        backgroundColor: selected ? "rgba(168,85,247,0.25)" : "rgba(88,28,135,0.6)",
      }}
    >
      {/* Rank badge */}
      <AnimatePresence>
        {selected && rank && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shadow"
            style={{ backgroundColor: "#a855f7", color: "#ffffff" }}
          >
            {rank}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Edit button - positioned bottom-right to avoid overlap with rank badge */}
      {!isEditing && (
        <button
          onClick={handleEditClick}
          className="absolute bottom-2 right-2 rounded-full p-1.5 transition-colors hover:bg-white/20"
          style={{ backgroundColor: "rgba(168,85,247,0.3)" }}
        >
          <Pencil className="h-3 w-3 text-white/80" />
        </button>
      )}

      <div className="flex items-start gap-2">
        {selected && (
          <Check className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: "#a855f7" }} />
        )}
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
              style={{ backgroundColor: "rgba(168,85,247,0.3)", color: "#e9d5ff" }}
            >
              Custom
            </span>
          </div>
          {isEditing ? (
            <form onSubmit={handleSaveEdit} onClick={(e) => e.stopPropagation()} className="mt-1">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-lg border bg-white/10 px-2 py-1 text-sm text-white placeholder-white/50 focus:border-purple-400 focus:outline-none"
                style={{ borderColor: "rgba(168,85,247,0.5)" }}
                autoFocus
                maxLength={100}
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="submit"
                  className="rounded px-2 py-1 text-xs font-semibold"
                  style={{ backgroundColor: "#a855f7", color: "#ffffff" }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded px-2 py-1 text-xs font-semibold text-white/70 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h4 className="text-sm font-semibold leading-snug text-white md:text-base">
                {process.name}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-white/80 md:text-sm md:leading-relaxed">
                Your custom challenge
              </p>
            </>
          )}
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -bottom-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded px-3 py-1 text-xs shadow-lg"
            style={{ backgroundColor: "#1e3a5f", color: "#faf7f2" }}
          >
            Remove one priority first
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ProcessCard({
  process,
  zoneName,
}: {
  process: Process
  zoneName: string
}) {
  const { dispatch, filledCount, isProcessSelected, getProcessRank } = useSurvey()
  const selected = isProcessSelected(process.id)
  const rank = getProcessRank(process.id)
  const [shaking, setShaking] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  function handleClick() {
    if (selected) {
      dispatch({ type: "REMOVE_PRIORITY", payload: process.id })
      return
    }
    if (filledCount >= 5) {
      setShaking(true)
      setShowTooltip(true)
      setTimeout(() => setShaking(false), 500)
      setTimeout(() => setShowTooltip(false), 2000)
      return
    }
    dispatch({
      type: "ADD_PRIORITY",
      payload: { process, zoneName },
    })
  }

  return (
    <motion.button
      onClick={handleClick}
      animate={shaking ? { x: [0, -6, 6, -6, 6, 0] } : {}}
      transition={shaking ? { duration: 0.4 } : {}}
      whileHover={{ scale: 1.03 }}
      className={`relative flex h-full min-h-[120px] flex-col rounded-xl border p-5 text-left transition-colors backdrop-blur-sm ${
        selected
          ? "shadow-[0_0_12px_rgba(245,158,11,0.3)]"
          : "hover:shadow-[0_0_12px_rgba(245,158,11,0.2)]"
      }`}
      style={{
        borderColor: selected ? "#f59e0b" : "rgba(255,255,255,0.3)",
        backgroundColor: selected ? "rgba(245,158,11,0.2)" : "rgba(30,58,95,0.7)",
      }}
    >
      {/* Rank badge */}
      <AnimatePresence>
        {selected && rank && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shadow"
            style={{ backgroundColor: "#f59e0b", color: "#1e3a5f" }}
          >
            {rank}
          </motion.span>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-2">
        {selected && (
          <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber" />
        )}
        <div className="flex-1">
          <h4 className="text-sm font-semibold leading-snug text-white md:text-base">
            {process.name}
            {getAcronyms(process.name).map((acr) => (
              <AcronymTooltip key={acr} acronym={acr} />
            ))}
          </h4>
          <p className="mt-1.5 text-xs leading-relaxed text-white/80 md:text-sm md:leading-relaxed">
            {process.description}
          </p>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -bottom-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded px-3 py-1 text-xs shadow-lg"
            style={{ backgroundColor: "#1e3a5f", color: "#faf7f2" }}
          >
            Remove one priority first
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export function ZoneExpanded() {
  const { state, getCustomProcessesForZone } = useSurvey()
  const zone = ZONES.find((z) => z.id === state.activeZoneId)
  const customProcesses = zone ? getCustomProcessesForZone(zone.name) : []

  if (!zone) return null

  return (
    <motion.div
      key={zone.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-40"
    >
      {/* Full-screen background image */}
      <div className="absolute inset-0">
        <Image
          src={zone.image}
          alt={zone.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-navy/[0.72]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col overflow-y-auto pt-16 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="px-6 pt-8 text-center"
        >
          <h2 className="text-2xl font-bold text-cream md:text-4xl">
            {zone.name}
          </h2>
          <p className="mt-2 text-base text-white md:text-xl">{zone.subtitle}</p>
        </motion.div>

        {/* Process cards grid */}
        <div className="mx-auto mt-8 grid w-full max-w-5xl auto-rows-fr grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {zone.processes.map((process, i) => (
            <motion.div
              key={process.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
              className="flex"
            >
              <ProcessCard process={process} zoneName={zone.name} />
            </motion.div>
          ))}
          {/* Custom process tiles */}
          {customProcesses.map((cp, i) => (
            <motion.div
              key={cp.process.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (zone.processes.length + i) * 0.06, duration: 0.4 }}
              className="flex"
            >
              <CustomProcessCard process={cp.process} zoneName={zone.name} />
            </motion.div>
          ))}
          {/* Add custom process card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (zone.processes.length + customProcesses.length) * 0.06, duration: 0.4 }}
            className="flex"
          >
            <AddCustomProcessCard zoneName={zone.name} />
          </motion.div>
        </div>

        {/* Spacer for sticky bottom bar on mobile */}
        <div className="h-40 md:hidden" />
      </div>

      {/* Mobile priority bar - swipeable */}
      <MobileSwipeablePriorityBar />
    </motion.div>
  )
}

function MobileSwipeablePriorityBar() {
  const { state, dispatch, filledCount } = useSurvey()
  const [isHidden, setIsHidden] = useState(false)
  const filled = state.priorities.filter((p) => p !== null)

  if (filled.length === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 block md:hidden">
      <AnimatePresence>
        {!isHidden ? (
          <motion.div
            key="priority-bar"
            initial={{ x: 0 }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -100) {
                setIsHidden(true)
              }
            }}
            className="px-3 pb-3 pt-1"
            style={{ background: "linear-gradient(to top, rgba(30,58,95,0.95) 70%, transparent 100%)" }}
          >
            <div
              className="rounded-xl border p-3"
              style={{ borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(30,58,95,0.8)" }}
            >
              <div className="mb-2 flex items-center justify-between">
                <h4
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "rgba(250,247,242,0.6)" }}
                >
                  Your Priorities
                </h4>
                <div className="flex items-center gap-2">
                  <span
                    className="text-base font-bold"
                    style={{ color: "#ffffff" }}
                  >
                    {filled.length} / 5
                  </span>
                  <span className="text-[10px] text-white/40">swipe to hide</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {state.priorities.map((item, i) =>
                  item ? (
                    <button
                      key={item.process.id}
                      onClick={() =>
                        dispatch({ type: "REMOVE_PRIORITY", payload: item.process.id })
                      }
                      className="flex items-center gap-1 rounded-lg px-2.5 py-1"
                      style={{ backgroundColor: "#f59e0b" }}
                    >
                      <span
                        className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold"
                        style={{ backgroundColor: "#1e3a5f", color: "#faf7f2" }}
                      >
                        {i + 1}
                      </span>
                      <span className="max-w-[100px] truncate text-[11px] font-medium" style={{ color: "#1e3a5f" }}>
                        {item.process.name}
                      </span>
                    </button>
                  ) : null
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="show-button"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            onClick={() => setIsHidden(false)}
            className="mb-3 ml-3 flex items-center gap-2 rounded-full px-3 py-2 shadow-lg"
            style={{ backgroundColor: "#f59e0b", color: "#1e3a5f" }}
          >
            <span className="text-xs font-bold">{filledCount}/5</span>
            <span className="text-[10px]">tap to show</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
