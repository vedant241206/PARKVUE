-- Add RLS policies for admin_sessions table
CREATE POLICY "Admin sessions are private" 
ON public.admin_sessions 
FOR ALL 
USING (false);