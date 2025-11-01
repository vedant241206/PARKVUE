-- Update admin session function to check for @park emails instead of @somaiya.edu
CREATE OR REPLACE FUNCTION public.create_admin_session(admin_email text, admin_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  session_token text;
  result json;
BEGIN
  -- Verify admin credentials (email ends with @park and password is admin@DASH)
  IF admin_email NOT LIKE '%@park' OR admin_password != 'admin@DASH' THEN
    RETURN json_build_object('success', false, 'error', 'Invalid credentials');
  END IF;
  
  -- Generate session token
  session_token := encode(gen_random_bytes(32), 'hex');
  
  -- Insert session
  INSERT INTO public.admin_sessions (email, session_token)
  VALUES (admin_email, session_token);
  
  RETURN json_build_object('success', true, 'session_token', session_token);
END;
$function$;