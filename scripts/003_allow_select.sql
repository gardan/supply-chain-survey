-- Allow anonymous reads so the results dashboard can query data
DROP POLICY IF EXISTS "deny_select" ON public.survey_responses;
CREATE POLICY "allow_anonymous_select" ON public.survey_responses
  FOR SELECT
  USING (true);
