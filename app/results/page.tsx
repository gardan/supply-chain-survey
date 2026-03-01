"use client"

import { useState, useEffect, useMemo } from "react"
import { fetchSurveyResults, recordDashboardAccess } from "@/app/actions"
import { ZONES } from "@/lib/survey-data"
import Link from "next/link"
import { ArrowLeft, BarChart3, Linkedin, Lock, TrendingUp } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

const AREA_COLORS = [
  "#1e3a5f",
  "#f59e0b",
  "#0ea5e9",
  "#10b981",
  "#8b5cf6",
  "#f43f5e",
]

interface SurveyRow {
  id: string
  industry: string
  company_size: string
  priority_1_zone: string
  priority_1_process: string
  priority_2_zone: string
  priority_2_process: string
  priority_3_zone: string
  priority_3_process: string
  priority_4_zone: string | null
  priority_4_process: string | null
  priority_5_zone: string | null
  priority_5_process: string | null
  created_at: string
}

function LinkedInGate({ onUnlock }: { onUnlock: () => void }) {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = url.trim()
    if (
      !trimmed.includes("linkedin.com/in/") &&
      !trimmed.includes("linkedin.com/company/")
    ) {
      setError("Please enter a valid LinkedIn profile URL (e.g. https://linkedin.com/in/yourname)")
      return
    }
    setSubmitting(true)
    await recordDashboardAccess(trimmed)
    setSubmitting(false)
    onUnlock()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4" style={{ backgroundColor: "#faf7f2" }}>
      <div className="w-full max-w-md rounded-2xl border p-8 shadow-lg" style={{ backgroundColor: "#ffffff", borderColor: "#d4cfc7" }}>
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: "rgba(30,58,95,0.1)" }}>
            <Lock className="h-7 w-7" style={{ color: "#1e3a5f" }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "#1e3a5f" }}>
            View Survey Results
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#6b7c93" }}>
            Enter your LinkedIn profile URL to access the results dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: "#6b7c93" }} />
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError("") }}
              placeholder="https://linkedin.com/in/yourname"
              className="w-full rounded-lg border py-3 pl-11 pr-4 text-sm outline-none transition-all focus:ring-2"
              style={{
                borderColor: error ? "#ef4444" : "#d4cfc7",
                color: "#1e3a5f",
                backgroundColor: "#faf7f2",
              }}
              required
            />
          </div>
          {error && (
            <p className="text-xs" style={{ color: "#ef4444" }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg py-3 text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#f59e0b", color: "#1e3a5f" }}
          >
            {submitting ? "Unlocking..." : "Unlock Dashboard"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-xs transition-opacity hover:opacity-70"
          style={{ color: "#6b7c93" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to survey
        </Link>
      </div>
    </div>
  )
}

function Dashboard() {
  const [rows, setRows] = useState<SurveyRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSurveyResults().then((res) => {
      if (res.success) setRows(res.data as SurveyRow[])
      setLoading(false)
    })
  }, [])

  const { processVotes, areaData, totalResponses } = useMemo(() => {
    const votesMap: Record<string, { process: string; zone: string; count: number }> = {}
    const areaVotes: Record<string, number> = {}

    for (const row of rows) {
      const priorities = [
        { zone: row.priority_1_zone, process: row.priority_1_process },
        { zone: row.priority_2_zone, process: row.priority_2_process },
        { zone: row.priority_3_zone, process: row.priority_3_process },
        { zone: row.priority_4_zone, process: row.priority_4_process },
        { zone: row.priority_5_zone, process: row.priority_5_process },
      ]

      for (const p of priorities) {
        if (!p.process) continue
        const key = `${p.zone}::${p.process}`
        if (!votesMap[key]) {
          votesMap[key] = { process: p.process, zone: p.zone, count: 0 }
        }
        votesMap[key].count++

        if (!areaVotes[p.zone]) areaVotes[p.zone] = 0
        areaVotes[p.zone]++
      }
    }

    const processVotes = Object.values(votesMap).sort((a, b) => b.count - a.count)

    const areaData = ZONES
      .map((z, i) => ({
        name: z.shortName,
        fullName: z.name,
        value: areaVotes[z.name] ?? 0,
        color: AREA_COLORS[i],
      }))
      .filter((a) => a.value > 0)

    return { processVotes, areaData, totalResponses: rows.length }
  }, [rows])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#faf7f2" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "#d4cfc7", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "#6b7c93" }}>Loading results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-3 py-6 sm:px-4 md:px-8 md:py-8" style={{ backgroundColor: "#faf7f2" }}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10" style={{ backgroundColor: "rgba(30,58,95,0.1)" }}>
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#1e3a5f" }} />
            </div>
            <div>
              <h1 className="text-lg font-bold sm:text-xl md:text-2xl" style={{ color: "#1e3a5f" }}>
                Survey Results Dashboard
              </h1>
              <p className="text-[11px] sm:text-xs" style={{ color: "#6b7c93" }}>
                {totalResponses} response{totalResponses !== 1 ? "s" : ""} collected
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="flex w-fit items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80 sm:px-4 sm:py-2 sm:text-sm"
            style={{ borderColor: "#d4cfc7", color: "#1e3a5f" }}
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Back to survey
          </Link>
        </div>

        {totalResponses === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border py-20 text-center" style={{ borderColor: "#d4cfc7", backgroundColor: "#ffffff" }}>
            <TrendingUp className="h-12 w-12" style={{ color: "#d4cfc7" }} />
            <p className="text-lg font-semibold" style={{ color: "#1e3a5f" }}>No responses yet</p>
            <p className="max-w-sm text-sm" style={{ color: "#6b7c93" }}>
              Once participants complete the survey, results will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            {/* Process votes table */}
            <div className="rounded-2xl border p-4 shadow-sm sm:p-6" style={{ backgroundColor: "#ffffff", borderColor: "#d4cfc7" }}>
              <h2 className="mb-1 text-sm font-bold sm:text-base" style={{ color: "#1e3a5f" }}>
                Processes by Votes
              </h2>
              <p className="mb-4 text-[11px] sm:mb-5 sm:text-xs" style={{ color: "#6b7c93" }}>
                All selected processes ranked by total number of votes
              </p>
              <div className="flex flex-col gap-2">
                {processVotes.map((item, i) => {
                  const maxVotes = processVotes[0]?.count ?? 1
                  const pct = (item.count / maxVotes) * 100
                  return (
                    <div key={`${item.zone}-${item.process}`} className="group flex items-center gap-2 sm:gap-3">
                      <span
                        className="w-5 flex-shrink-0 text-right text-[11px] font-bold sm:w-7 sm:text-xs"
                        style={{ color: "#6b7c93" }}
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-baseline justify-between gap-1 sm:gap-2">
                          <span className="truncate text-xs font-semibold sm:text-sm" style={{ color: "#1e3a5f" }}>
                            {item.process}
                          </span>
                          <span className="flex-shrink-0 text-sm font-bold sm:text-base" style={{ color: "#1e3a5f" }}>
                            {item.count}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div
                            className="h-1.5 rounded-full transition-all sm:h-2"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: AREA_COLORS[ZONES.findIndex((z) => z.name === item.zone) % AREA_COLORS.length],
                              minWidth: "4px",
                            }}
                          />
                          <span className="hidden flex-shrink-0 text-[10px] sm:inline" style={{ color: "#6b7c93" }}>
                            {item.zone}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Pie chart */}
            <div className="rounded-2xl border p-4 shadow-sm sm:p-6" style={{ backgroundColor: "#ffffff", borderColor: "#d4cfc7" }}>
              <h2 className="mb-1 text-sm font-bold sm:text-base" style={{ color: "#1e3a5f" }}>
                Votes by Area
              </h2>
              <p className="mb-3 text-[11px] sm:mb-4 sm:text-xs" style={{ color: "#6b7c93" }}>
                Distribution of total process selections across supply chain areas
              </p>
              <div className="h-[260px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={areaData}
                      dataKey="value"
                      nameKey="fullName"
                      cx="50%"
                      cy="45%"
                      outerRadius="75%"
                      innerRadius="35%"
                      paddingAngle={2}
                      stroke="none"
                    >
                      {areaData.map((entry, i) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #d4cfc7",
                        borderRadius: "8px",
                        fontSize: "13px",
                        color: "#1e3a5f",
                      }}
                      formatter={(value: number, name: string) => [`${value} votes`, name]}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span style={{ color: "#1e3a5f", fontSize: "12px" }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend cards */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {areaData.map((area) => {
                  const totalVotes = areaData.reduce((s, a) => s + a.value, 0)
                  const pct = totalVotes > 0 ? Math.round((area.value / totalVotes) * 100) : 0
                  return (
                    <div
                      key={area.name}
                      className="flex items-center gap-2 rounded-lg px-3 py-2"
                      style={{ backgroundColor: "#faf7f2" }}
                    >
                      <div className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: area.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs font-semibold" style={{ color: "#1e3a5f" }}>{area.name}</p>
                        <p className="text-[10px]" style={{ color: "#6b7c93" }}>{pct}% ({area.value})</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const [unlocked, setUnlocked] = useState(false)

  return unlocked ? <Dashboard /> : <LinkedInGate onUnlock={() => setUnlocked(true)} />
}
