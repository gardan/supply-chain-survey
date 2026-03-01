"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Info } from "lucide-react"

const ACRONYM_DEFINITIONS: Record<string, string> = {
  "S&OP": "Sales and Operations Planning",
  "BOM": "Bill Of Materials",
  "MDF": "Marketing Development Funds",
  "HS": "Harmonized System",
  "FTA": "Free Trade Agreement",
  "FTAs": "Free Trade Agreements",
}

export function AcronymTooltip({ acronym }: { acronym: string }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })
  const [mounted, setMounted] = useState(false)
  const iconRef = useRef<HTMLSpanElement>(null)
  const definition = ACRONYM_DEFINITIONS[acronym]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (showTooltip && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect()
      setTooltipPos({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      })
    }
  }, [showTooltip])

  if (!definition) return null

  return (
    <>
      <span
        ref={iconRef}
        className="ml-1 inline-flex cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onTouchStart={() => setShowTooltip(true)}
        onTouchEnd={() => setTimeout(() => setShowTooltip(false), 2000)}
      >
        <span
          className="inline-flex h-4 w-4 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        >
          <Info className="h-3 w-3" style={{ color: "rgba(255,255,255,0.8)" }} />
        </span>
      </span>
      {mounted && showTooltip && createPortal(
        <span
          className="pointer-events-none fixed -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium shadow-xl"
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            backgroundColor: "#1e3a5f",
            color: "#faf7f2",
            zIndex: 99999,
          }}
        >
          <span className="font-bold" style={{ color: "#f59e0b" }}>{acronym}</span>
          {" = "}
          {definition}
          <span
            className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent"
            style={{ borderTopColor: "#1e3a5f" }}
          />
        </span>,
        document.body
      )}
    </>
  )
}

// Check if text contains any known acronym
export function hasAcronym(text: string): string | null {
  for (const acronym of Object.keys(ACRONYM_DEFINITIONS)) {
    // Match whole word only (with word boundaries or special chars)
    const regex = new RegExp(`\\b${acronym}\\b|^${acronym}\\s|\\s${acronym}\\s|\\s${acronym}$`)
    if (regex.test(text)) {
      return acronym
    }
  }
  return null
}

// Get all acronyms in text
export function getAcronyms(text: string): string[] {
  const found: string[] = []
  for (const acronym of Object.keys(ACRONYM_DEFINITIONS)) {
    const regex = new RegExp(`\\b${acronym}\\b`)
    if (regex.test(text)) {
      found.push(acronym)
    }
  }
  return found
}
