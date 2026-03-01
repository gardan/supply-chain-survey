"use client"

import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from "react"
import type { Process } from "./survey-data"

const STORAGE_KEY = "survey-state"

export type AppState = "welcome" | "overview" | "zone" | "submit"

export interface PriorityItem {
  process: Process
  zoneName: string
}

export interface CustomProcess {
  process: Process
  zoneName: string
}

interface SurveyState {
  appState: AppState
  activeZoneId: number | null
  priorities: (PriorityItem | null)[]
  customProcesses: CustomProcess[]
  industry: string
  companySize: string
  linkedinUrl: string
  submitted: boolean
}

type SurveyAction =
  | { type: "SET_STATE"; payload: AppState }
  | { type: "SET_ACTIVE_ZONE"; payload: number | null }
  | { type: "ADD_PRIORITY"; payload: PriorityItem }
  | { type: "REMOVE_PRIORITY"; payload: string }
  | { type: "REORDER_PRIORITIES"; payload: (PriorityItem | null)[] }
  | { type: "ADD_CUSTOM_PROCESS"; payload: CustomProcess }
  | { type: "SET_CUSTOM_PROCESSES"; payload: CustomProcess[] }
  | { type: "UPDATE_CUSTOM_PROCESS"; payload: { processId: string; name: string } }
  | { type: "SET_INDUSTRY"; payload: string }
  | { type: "SET_COMPANY_SIZE"; payload: string }
  | { type: "SET_LINKEDIN_URL"; payload: string }
  | { type: "SET_SUBMITTED"; payload: boolean }

const initialState: SurveyState = {
  appState: "welcome",
  activeZoneId: null,
  priorities: [null, null, null, null, null],
  customProcesses: [],
  industry: "",
  companySize: "",
  linkedinUrl: "",
  submitted: false,
}

function surveyReducer(state: SurveyState, action: SurveyAction): SurveyState {
  switch (action.type) {
    case "SET_STATE":
      return { ...state, appState: action.payload }
    case "SET_ACTIVE_ZONE":
      return { ...state, activeZoneId: action.payload }
    case "ADD_PRIORITY": {
      const nextSlot = state.priorities.findIndex((p) => p === null)
      if (nextSlot === -1) return state
      const newPriorities = [...state.priorities]
      newPriorities[nextSlot] = action.payload
      return { ...state, priorities: newPriorities }
    }
    case "REMOVE_PRIORITY": {
      const newPriorities = state.priorities.map((p) =>
        p && p.process.id === action.payload ? null : p
      )
      // Compact: shift non-null items to the front
      const compacted = newPriorities.filter((p) => p !== null)
      while (compacted.length < 5) compacted.push(null)
      return { ...state, priorities: compacted }
    }
    case "REORDER_PRIORITIES":
      return { ...state, priorities: action.payload }
    case "ADD_CUSTOM_PROCESS":
      return { ...state, customProcesses: [...state.customProcesses, action.payload] }
    case "SET_CUSTOM_PROCESSES":
      return { ...state, customProcesses: action.payload }
    case "UPDATE_CUSTOM_PROCESS": {
      const { processId, name } = action.payload
      // Update in customProcesses
      const updatedCustom = state.customProcesses.map((cp) =>
        cp.process.id === processId
          ? { ...cp, process: { ...cp.process, name } }
          : cp
      )
      // Also update in priorities
      const updatedPriorities = state.priorities.map((p) =>
        p && p.process.id === processId
          ? { ...p, process: { ...p.process, name } }
          : p
      )
      return { ...state, customProcesses: updatedCustom, priorities: updatedPriorities }
    }
    case "SET_INDUSTRY":
      return { ...state, industry: action.payload }
    case "SET_COMPANY_SIZE":
      return { ...state, companySize: action.payload }
    case "SET_LINKEDIN_URL":
      return { ...state, linkedinUrl: action.payload }
    case "SET_SUBMITTED":
      return { ...state, submitted: action.payload }
    default:
      return state
  }
}

interface SurveyContextType {
  state: SurveyState
  dispatch: React.Dispatch<SurveyAction>
  filledCount: number
  isProcessSelected: (processId: string) => boolean
  getProcessRank: (processId: string) => number | null
  getCustomProcessesForZone: (zoneName: string) => CustomProcess[]
}

const SurveyContext = createContext<SurveyContextType | null>(null)

export function SurveyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(surveyReducer, initialState)
  const [hydrated, setHydrated] = useState(false)

  // Restore state from sessionStorage after hydration
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as SurveyState
        // Restore priorities
        if (parsed.priorities) {
          dispatch({ type: "REORDER_PRIORITIES", payload: parsed.priorities })
        }
        // If user had selections, go to overview instead of welcome
        if (parsed.priorities?.some((p: PriorityItem | null) => p !== null)) {
          dispatch({ type: "SET_STATE", payload: "overview" })
        }
        if (parsed.industry) {
          dispatch({ type: "SET_INDUSTRY", payload: parsed.industry })
        }
        if (parsed.companySize) {
          dispatch({ type: "SET_COMPANY_SIZE", payload: parsed.companySize })
        }
        if (parsed.linkedinUrl) {
          dispatch({ type: "SET_LINKEDIN_URL", payload: parsed.linkedinUrl })
        }
        if (parsed.customProcesses) {
          dispatch({ type: "SET_CUSTOM_PROCESSES", payload: parsed.customProcesses })
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  // Persist state to sessionStorage after hydration
  useEffect(() => {
    if (!hydrated) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state, hydrated])

  const filledCount = state.priorities.filter((p) => p !== null).length

  const isProcessSelected = (processId: string) =>
    state.priorities.some((p) => p !== null && p.process.id === processId)

  const getProcessRank = (processId: string): number | null => {
    const idx = state.priorities.findIndex(
      (p) => p !== null && p.process.id === processId
    )
    return idx >= 0 ? idx + 1 : null
  }

  const getCustomProcessesForZone = (zoneName: string) =>
    state.customProcesses.filter((cp) => cp.zoneName === zoneName)

  return (
    <SurveyContext.Provider
      value={{ state, dispatch, filledCount, isProcessSelected, getProcessRank, getCustomProcessesForZone }}
    >
      {children}
    </SurveyContext.Provider>
  )
}

export function useSurvey() {
  const context = useContext(SurveyContext)
  if (!context) throw new Error("useSurvey must be used within SurveyProvider")
  return context
}
