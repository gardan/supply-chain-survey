-- Create the survey responses table for anonymous submissions
CREATE TABLE IF NOT EXISTS public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT NOT NULL,
  company_size TEXT NOT NULL,
  priority_1_id TEXT NOT NULL,
  priority_1_name TEXT NOT NULL,
  priority_1_zone TEXT NOT NULL,
  priority_2_id TEXT NOT NULL,
  priority_2_name TEXT NOT NULL,
  priority_2_zone TEXT NOT NULL,
  priority_3_id TEXT NOT NULL,
  priority_3_name TEXT NOT NULL,
  priority_3_zone TEXT NOT NULL,
  priority_4_id TEXT NOT NULL,
  priority_4_name TEXT NOT NULL,
  priority_4_zone TEXT NOT NULL,
  priority_5_id TEXT NOT NULL,
  priority_5_name TEXT NOT NULL,
  priority_5_zone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (no auth required for survey submissions)
CREATE POLICY "allow_anonymous_insert" ON public.survey_responses
  FOR INSERT
  WITH CHECK (true);

-- Block all reads/updates/deletes from the client (admin only via service role)
CREATE POLICY "deny_select" ON public.survey_responses
  FOR SELECT
  USING (false);

CREATE POLICY "deny_update" ON public.survey_responses
  FOR UPDATE
  USING (false);

CREATE POLICY "deny_delete" ON public.survey_responses
  FOR DELETE
  USING (false);
