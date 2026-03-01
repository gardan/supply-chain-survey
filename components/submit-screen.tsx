"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useSurvey } from "@/lib/survey-context"
import { INDUSTRIES, COMPANY_SIZES, ZONES } from "@/lib/survey-data"
import { submitSurvey } from "@/app/actions"

export function SubmitScreen() {
  const { state, dispatch } = useSurvey()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [industryOpen, setIndustryOpen] = useState(false)
  const [sizeOpen, setSizeOpen] = useState(false)

  const filledPriorities = state.priorities.filter((p) => p !== null)
  const canSubmit =
    filledPriorities.length >= 3 &&
    state.industry !== "" &&
    state.companySize !== ""

  function handleSubmit() {
    if (!canSubmit) return
    setError(null)

    const priorities = filledPriorities.map((p) => ({
      zone: ZONES.find((z) => z.id === p!.process.zoneId)?.name ?? "",
      process: p!.process.name,
    }))

    startTransition(async () => {
      const result = await submitSurvey({
        industry: state.industry,
        companySize: state.companySize,
        linkedinUrl: state.linkedinUrl || undefined,
        priorities,
      })
      if (result.success) {
        dispatch({ type: "SET_SUBMITTED", payload: true })
      } else {
        setError(result.error ?? "Something went wrong. Please try again.")
      }
    })
  }

  if (state.submitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen flex-col items-center justify-center px-6"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex flex-col items-center text-center"
        >
          <CheckCircle2 className="mb-4 h-16 w-16" style={{ color: "#f59e0b" }} />
          <h2 className="mb-2 text-2xl font-bold text-navy md:text-3xl">
            Thank you!
          </h2>
          <p className="max-w-md text-muted-foreground">
            Your supply chain priorities have been recorded. We will share the
            collective insights with all participants soon.
          </p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-screen flex-col items-center justify-center px-6 pt-20 pb-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <h2 className="mb-2 text-center text-2xl font-bold text-navy md:text-3xl">
          Almost done!
        </h2>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Review your priorities and tell us a bit about your company.
        </p>

        {/* Priority summary */}
        <div className="mb-8 rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Your Top Priorities
          </h3>
          <div className="flex flex-col gap-2">
            {state.priorities.map((item, i) =>
              item ? (
                <div key={item.process.id} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber text-xs font-bold text-navy">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy">
                      {item.process.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.zoneName}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_PRIORITY",
                        payload: item.process.id,
                      })
                    }
                    className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                    aria-label={`Remove ${item.process.name}`}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div key={`empty-${i}`} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-border text-xs text-muted-foreground">
                    {i + 1}
                  </span>
                  <p className="text-sm italic text-muted-foreground">
                    Empty slot (optional)
                  </p>
                </div>
              )
            )}
          </div>
          {filledPriorities.length < 3 && (
            <p className="mt-3 text-xs text-destructive">
              Please select at least 3 priorities to continue.
            </p>
          )}
          <button
            onClick={() => {
              dispatch({ type: "SET_STATE", payload: "overview" })
              dispatch({ type: "SET_ACTIVE_ZONE", payload: null })
            }}
            className="mt-3 text-xs font-medium text-navy underline underline-offset-2 transition-colors hover:text-amber"
          >
            Back to areas to edit
          </button>
        </div>

        {/* Industry selector */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Industry
          </label>
          <div className="relative">
            <button
              onClick={() => {
                setIndustryOpen(!industryOpen)
                setSizeOpen(false)
              }}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-left text-sm text-navy transition-colors hover:border-amber"
            >
              <span className={state.industry ? "text-navy" : "text-muted-foreground"}>
                {state.industry || "Select your industry"}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  industryOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {industryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border shadow-lg"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
                >
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => {
                        dispatch({ type: "SET_INDUSTRY", payload: ind })
                        setIndustryOpen(false)
                      }}
                      className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors hover:bg-secondary ${
                        state.industry === ind
                          ? "font-medium"
                          : ""
                      }`}
                      style={{
                        color: "#1e3a5f",
                        backgroundColor: state.industry === ind ? "rgba(245,158,11,0.1)" : undefined,
                      }}
                    >
                      {ind}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Company size selector */}
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Company Size
          </label>
          <div className="relative">
            <button
              onClick={() => {
                setSizeOpen(!sizeOpen)
                setIndustryOpen(false)
              }}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-left text-sm text-navy transition-colors hover:border-amber"
            >
              <span className={state.companySize ? "text-navy" : "text-muted-foreground"}>
                {state.companySize || "Select company size"}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  sizeOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {sizeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border shadow-lg"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
                >
                  {COMPANY_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        dispatch({ type: "SET_COMPANY_SIZE", payload: size })
                        setSizeOpen(false)
                      }}
                      className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors hover:bg-secondary ${
                        state.companySize === size
                          ? "font-medium"
                          : ""
                      }`}
                      style={{
                        color: "#1e3a5f",
                        backgroundColor: state.companySize === size ? "rgba(245,158,11,0.1)" : undefined,
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* LinkedIn URL (optional) */}
        <div className="mb-8">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            LinkedIn Profile
            <span className="ml-1 font-normal normal-case tracking-normal text-muted-foreground/60">(optional)</span>
          </label>
          <input
            type="url"
            value={state.linkedinUrl}
            onChange={(e) =>
              dispatch({ type: "SET_LINKEDIN_URL", payload: e.target.value })
            }
            onFocus={() => {
              setIndustryOpen(false)
              setSizeOpen(false)
            }}
            placeholder="https://linkedin.com/in/your-profile"
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-navy placeholder-muted-foreground transition-colors focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
          />
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mb-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm"
              style={{
                borderColor: "rgba(239,68,68,0.3)",
                backgroundColor: "rgba(239,68,68,0.1)",
                color: "#ef4444",
              }}
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <motion.button
          whileHover={canSubmit ? { scale: 1.02 } : {}}
          whileTap={canSubmit ? { scale: 0.98 } : {}}
          onClick={handleSubmit}
          disabled={!canSubmit || isPending}
          className={`w-full rounded-xl py-4 text-center text-base font-bold transition-all ${
            canSubmit
              ? "shadow-lg hover:shadow-xl"
              : "cursor-not-allowed"
          }`}
          style={{
            backgroundColor: canSubmit ? "#f59e0b" : "var(--border)",
            color: canSubmit ? "#1e3a5f" : "var(--muted-foreground)",
          }}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </span>
          ) : (
            "Submit My Priorities"
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
