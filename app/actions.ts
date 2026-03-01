"use server"

import { createClient } from "@/lib/supabase/server"

interface SubmitSurveyData {
  industry: string
  companySize: string
  linkedinUrl?: string
  priorities: {
    zone: string
    process: string
  }[]
}

export async function submitSurvey(data: SubmitSurveyData) {
  const supabase = await createClient()

  const row: Record<string, string | undefined> = {
    industry: data.industry,
    company_size: data.companySize,
    linkedin_url: data.linkedinUrl || undefined,
    priority_1_zone: data.priorities[0]?.zone ?? "",
    priority_1_process: data.priorities[0]?.process ?? "",
    priority_2_zone: data.priorities[1]?.zone ?? "",
    priority_2_process: data.priorities[1]?.process ?? "",
    priority_3_zone: data.priorities[2]?.zone ?? "",
    priority_3_process: data.priorities[2]?.process ?? "",
  }

  if (data.priorities[3]) {
    row.priority_4_zone = data.priorities[3].zone
    row.priority_4_process = data.priorities[3].process
  }
  if (data.priorities[4]) {
    row.priority_5_zone = data.priorities[4].zone
    row.priority_5_process = data.priorities[4].process
  }

  const { error } = await supabase.from("survey_responses").insert(row)

  if (error) {
    console.error("Survey submission error:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function recordDashboardAccess(linkedinUrl: string) {
  const supabase = await createClient()
  const trimmed = linkedinUrl.trim().toLowerCase()

  // Check if this LinkedIn URL already exists
  const { data: existing } = await supabase
    .from("dashboard_access")
    .select("id, access_count")
    .eq("linkedin_url", trimmed)
    .single()

  if (existing) {
    // Increment the count and update last_accessed_at
    const { error } = await supabase
      .from("dashboard_access")
      .update({
        access_count: existing.access_count + 1,
        last_accessed_at: new Date().toISOString(),
      })
      .eq("id", existing.id)

    if (error) {
      console.error("Dashboard access update error:", error)
      return { success: false, error: error.message }
    }
  } else {
    // Insert new record
    const { error } = await supabase
      .from("dashboard_access")
      .insert({ linkedin_url: trimmed })

    if (error) {
      console.error("Dashboard access insert error:", error)
      return { success: false, error: error.message }
    }
  }

  return { success: true }
}

export async function fetchSurveyResults() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("survey_responses")
    .select("*")

  if (error) {
    console.error("Fetch results error:", error)
    return { success: false, error: error.message, data: [] }
  }

  return { success: true, data: data ?? [] }
}
