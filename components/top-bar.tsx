"use client"

import Image from "next/image"
import { LayoutGrid, ArrowRight } from "lucide-react"
import { useSurvey } from "@/lib/survey-context"
import { ZONES } from "@/lib/survey-data"
import { PriorityBar } from "./priority-bar"

export function TopBar() {
  const { state, dispatch, filledCount } = useSurvey()
  const showSubmit = filledCount === 5 && state.appState !== "submit"

  function handleSubmitClick() {
    dispatch({ type: "SET_STATE", payload: "submit" })
  }

  function handleLogoClick() {
    if (state.appState === "zone" || state.appState === "submit") {
      dispatch({ type: "SET_STATE", payload: "overview" })
      dispatch({ type: "SET_ACTIVE_ZONE", payload: null })
    }
  }

  function handleZoneThumbnailClick(zoneId: number) {
    if (state.appState === "zone" || state.appState === "overview") {
      dispatch({ type: "SET_ACTIVE_ZONE", payload: zoneId })
      dispatch({ type: "SET_STATE", payload: "zone" })
    }
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-50 grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b px-4 py-2 backdrop-blur-sm lg:px-6" style={{ borderColor: "rgba(30,58,95,0.1)", backgroundColor: "rgba(250,247,242,0.95)" }}>
      {/* Left: Home button */}
      <button
        onClick={handleLogoClick}
        className="flex h-9 flex-shrink-0 items-center gap-2 rounded-md px-3 shadow-sm transition-all duration-200 hover:shadow-md"
        style={{ backgroundColor: "#1e3a5f", color: "#faf7f2" }}
        aria-label="Return to area overview"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide">
          All Areas
        </span>
      </button>

      {/* Center: Priority Bar (desktop) */}
      <div className="hidden justify-center md:flex">
        <PriorityBar />
      </div>

      {/* Center: Mobile priority count + submit */}
      <div className="flex items-center justify-center gap-3 md:hidden">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "#1e3a5f" }}
          >
            Challenges
          </span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-2 w-5 rounded-full"
                style={{
                  backgroundColor: state.priorities[i] ? "#f59e0b" : "rgba(30,58,95,0.15)",
                }}
              />
            ))}
          </div>
        </div>
        {showSubmit && (
          <button
            onClick={handleSubmitClick}
            className="animate-pulse-amber flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "#f59e0b", color: "#1e3a5f" }}
            aria-label="Submit your top 5 challenges"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Right: Zone Thumbnails */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Mini zone thumbnails */}
        <div className="hidden items-center gap-1 lg:flex">
          {ZONES.map((zone) => (
            <button
              key={zone.id}
              onClick={() => handleZoneThumbnailClick(zone.id)}
              className={`flex flex-col items-center gap-0.5 transition-opacity hover:opacity-80 ${
                state.activeZoneId === zone.id
                  ? "opacity-100"
                  : "opacity-60"
              }`}
            >
              <div
                className="relative h-10 w-10 overflow-hidden rounded"
                style={{
                  boxShadow: state.activeZoneId === zone.id
                    ? "0 0 0 2px #f59e0b"
                    : "0 0 0 1px rgba(30,58,95,0.2)",
                }}
              >
                <Image
                  src={zone.image}
                  alt={zone.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <span className="max-w-[48px] truncate text-[9px] leading-tight" style={{ color: "#1e3a5f" }}>
                {zone.shortName}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
