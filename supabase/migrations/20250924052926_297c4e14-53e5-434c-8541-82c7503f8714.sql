-- Fix admin session policies
DROP POLICY IF EXISTS "Admin can view all bookings" ON public.bookings;

-- Create a simple admin policy that checks for admin email in the database
CREATE POLICY "Admin can view all bookings" 
ON public.bookings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.admin_sessions 
    WHERE email LIKE '%@somaiya.edu'
    AND expires_at > now()
  )
);

-- Add function to set admin context (simplified)
CREATE OR REPLACE FUNCTION public.set_admin_context(session_token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Just verify if the token exists and is valid
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_sessions 
    WHERE session_token = set_admin_context.session_token 
    AND expires_at > now()
  );
END;
$$;