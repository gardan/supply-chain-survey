"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence } from "framer-motion"
import { BarChart3 } from "lucide-react"
import { SurveyProvider, useSurvey } from "@/lib/survey-context"
import { TopBar } from "@/components/top-bar"
import { WelcomeScreen } from "@/components/welcome-screen"
import { ZoneOverview } from "@/components/zone-overview"
import { ZoneExpanded } from "@/components/zone-expanded"
import { SubmitScreen } from "@/components/submit-screen"

function ResultsButton() {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href="/results"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-3 py-2.5 shadow-lg transition-all duration-200 hover:shadow-xl"
      style={{
        backgroundColor: "#1e3a5f",
        color: "#faf7f2",
      }}
    >
      <BarChart3 className="h-4 w-4" />
      {hovered && (
        <span className="whitespace-nowrap pr-1 text-xs font-semibold">
          See results
        </span>
      )}
    </Link>
  )
}

function SurveyApp() {
  const { state } = useSurvey()

  return (
    <div className="min-h-screen bg-background">
      {state.appState !== "welcome" && <TopBar />}

      <AnimatePresence mode="wait">
        {state.appState === "welcome" && <WelcomeScreen key="welcome" />}
        {state.appState === "overview" && <ZoneOverview key="overview" />}
        {state.appState === "zone" && <ZoneExpanded key="zone" />}
        {state.appState === "submit" && <SubmitScreen key="submit" />}
      </AnimatePresence>

      <ResultsButton />
    </div>
  )
}

export default function Home() {
  return (
    <SurveyProvider>
      <SurveyApp />
    </SurveyProvider>
  )
}
