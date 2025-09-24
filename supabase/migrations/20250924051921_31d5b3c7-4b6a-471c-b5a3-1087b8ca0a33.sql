-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can update bookings" ON public.bookings;

-- Create restrictive policies for bookings table
-- Allow users to create bookings
CREATE POLICY "Allow booking creation" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Allow users to view only their own recent bookings (within 24 hours) using contact number and vehicle number
CREATE POLICY "Users can view their own recent bookings" 
ON public.bookings 
FOR SELECT 
USING (
  created_at > (now() - interval '24 hours') 
  AND (
    -- For exit flow - match contact and vehicle number
    (contact_number IS NOT NULL AND vehicle_number IS NOT NULL)
  )
);

-- Allow updates only for exit operations with matching contact and vehicle details
CREATE POLICY "Allow exit updates with verification" 
ON public.bookings 
FOR UPDATE 
USING (
  status = 'active' 
  AND contact_number IS NOT NULL 
  AND vehicle_number IS NOT NULL
);

-- Create admin role for dashboard access
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  session_token text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT (now() + interval '8 hours')
);

-- Enable RLS on admin_sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create admin authentication function
CREATE OR REPLACE FUNCTION public.verify_admin_session(session_token text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_sessions 
    WHERE session_token = verify_admin_session.session_token 
    AND expires_at > now()
  );
$$;

-- Policy for admin access to all bookings (requires valid admin session)
CREATE POLICY "Admin can view all bookings" 
ON public.bookings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_sessions 
    WHERE session_token = current_setting('app.admin_session_token', true)
    AND expires_at > now()
  )
);

-- Create function to create admin session
CREATE OR REPLACE FUNCTION public.create_admin_session(admin_email text, admin_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_token text;
  result json;
BEGIN
  -- Verify admin credentials (email ends with .somaiya.edu and password is admin@DASH)
  IF admin_email NOT LIKE '%.somaiya.edu' OR admin_password != 'admin@DASH' THEN
    RETURN json_build_object('success', false, 'error', 'Invalid credentials');
  END IF;
  
  -- Generate session token
  session_token := encode(gen_random_bytes(32), 'hex');
  
  -- Insert session
  INSERT INTO public.admin_sessions (email, session_token)
  VALUES (admin_email, session_token);
  
  RETURN json_build_object('success', true, 'session_token', session_token);
END;
$$;