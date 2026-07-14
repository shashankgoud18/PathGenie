-- Add completed_tasks text array to roadmaps
ALTER TABLE public.roadmaps ADD COLUMN completed_tasks TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Create atomic check-and-increment function as PostgreSQL fallback
CREATE OR REPLACE FUNCTION check_and_increment_api_usage(
  p_user_id UUID,
  p_api_type TEXT,
  p_endpoint TEXT,
  p_limit INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  v_current_count INTEGER := 0;
  v_today DATE := CURRENT_DATE;
  v_month_start DATE := date_trunc('month', CURRENT_DATE)::DATE;
BEGIN
  -- Get current month's total usage
  SELECT COALESCE(SUM(request_count), 0) INTO v_current_count
  FROM public.api_usage_tracking
  WHERE user_id = p_user_id
    AND api_type = p_api_type
    AND date >= v_month_start;

  -- Check if limit exceeded
  IF v_current_count >= p_limit THEN
    RETURN FALSE;
  END IF;

  -- Perform atomic increment/insert for today
  INSERT INTO public.api_usage_tracking (user_id, api_type, endpoint, date, request_count)
  VALUES (p_user_id, p_api_type, p_endpoint, v_today, 1)
  ON CONFLICT (user_id, api_type, date)
  DO UPDATE SET 
    request_count = public.api_usage_tracking.request_count + 1,
    endpoint = p_endpoint;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
