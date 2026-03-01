"use client"

import { motion } from "framer-motion"
import { useSurvey } from "@/lib/survey-context"

export function WelcomeScreen() {
  const { dispatch } = useSurvey()

  function handleStart() {
    dispatch({ type: "SET_STATE", payload: "overview" })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen flex-col items-center justify-center px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex max-w-2xl flex-col items-center text-center"
      >
        {/* Wordmark */}
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest text-navy/50">
          Supply Chain Intelligence Initiative
        </h2>

        {/* Headline */}
        <h1 className="mb-6 text-balance text-3xl font-bold leading-tight tracking-tight text-navy md:text-4xl">
          What are your biggest supply chain challenges in 2026?
        </h1>

        {/* Simplified tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-10 text-xl font-medium leading-relaxed text-navy/70 md:text-2xl"
        >
          Discover processes across 6 areas and select<br className="hidden sm:inline" />
          <span className="font-bold text-navy"> your top 5 challenges</span>
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleStart}
          className="rounded-xl px-10 py-4 text-lg font-bold shadow-lg transition-shadow hover:shadow-xl"
          style={{ backgroundColor: "#f59e0b", color: "#1e3a5f" }}
        >
          {"Start Exploring \u2192"}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
