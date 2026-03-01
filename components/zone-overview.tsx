"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useSurvey } from "@/lib/survey-context"
import { ZONES } from "@/lib/survey-data"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useState(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768)
    }
  })
  return isMobile
}

function ZoneCard({ zone, index }: { zone: (typeof ZONES)[0]; index: number }) {
  const { dispatch, state } = useSurvey()
  const [isHovered, setIsHovered] = useState(false)
  const isMobile = useIsMobile()
  const yOffset = isMobile ? 0 : index % 2 === 1 ? -20 : 0

  // Count how many priorities are selected from this zone
  const selectedCount = state.priorities.filter(
    (p) => p !== null && p.zoneName === zone.name
  ).length

  function handleClick() {
    dispatch({ type: "SET_ACTIVE_ZONE", payload: zone.id })
    dispatch({ type: "SET_STATE", payload: "zone" })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: yOffset }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.6, ease: "easeOut" }}
      className="relative cursor-pointer"
      style={{ translateY: yOffset }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Selection count badge */}
      {selectedCount > 0 && (
        <div
          className="absolute -right-1 -top-1 z-10 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold shadow-lg"
          style={{ backgroundColor: "#f59e0b", color: "#1e3a5f" }}
        >
          {selectedCount}
        </div>
      )}

      <motion.div
        animate={{ scale: isHovered ? 1.08 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-xl md:aspect-[2/3]"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 85% at center, black 50%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 85% 85% at center, black 50%, transparent 100%)",
        }}
      >
        <Image
          src={zone.image}
          alt={zone.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 16.6vw"
          priority
          loading="eager"
        />

        {/* Mobile: always-visible name overlay at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-4 pt-12 md:hidden"
          style={{ background: "linear-gradient(to top, rgba(10,25,47,0.85) 0%, transparent 100%)" }}
        >
          <h3
            className="px-2 text-center text-sm font-bold leading-snug"
            style={{ color: "#ffffff", textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
          >
            {zone.name}
          </h3>
        </div>

        {/* Desktop: hover overlay */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 hidden flex-col items-center justify-center md:flex"
          style={{ backgroundColor: "rgba(10, 25, 47, 0.75)" }}
        >
          <h3
            className="mb-2 px-3 text-center text-lg font-bold leading-snug md:text-xl"
            style={{ color: "#ffffff", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
          >
            {zone.name}
          </h3>
          <div
            className="mx-auto mb-4 h-0.5 w-12 rounded-full"
            style={{ backgroundColor: "#f59e0b" }}
          />
          <motion.span
            animate={{ y: isHovered ? [0, 4, 0] : 0 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-lg font-semibold tracking-wide"
            style={{ color: "#ffffff", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
          >
            Explore area
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function ZoneOverview() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen flex-col items-center px-4 pt-20 pb-8 md:pt-24"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-8 flex flex-col items-center gap-2 text-center md:mb-14"
      >
        <h2
          className="text-2xl font-bold tracking-tight md:text-3xl"
          style={{ color: "#1e3a5f" }}
        >
          Explore the Supply Chain Areas
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
          Select an area below to discover its processes and pick your top challenges.
        </p>
        <div className="mt-1 h-1 w-16 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
      </motion.div>

      {/* Desktop: single row */}
      <div className="hidden w-full max-w-7xl grid-cols-6 gap-3 pt-4 md:grid">
        {ZONES.map((zone, i) => (
          <ZoneCard key={zone.id} zone={zone} index={i} />
        ))}
      </div>

      {/* Mobile: 2x3 grid */}
      <div className="grid w-full max-w-md grid-cols-2 gap-3 md:hidden">
        {ZONES.map((zone, i) => (
          <ZoneCard key={zone.id} zone={zone} index={i} />
        ))}
      </div>
    </motion.div>
  )
}
