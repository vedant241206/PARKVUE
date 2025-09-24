-- Fix RLS policies for bookings table to allow updates
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."bookings";
DROP POLICY IF EXISTS "Enable insert for all users" ON "public"."bookings";
DROP POLICY IF EXISTS "Enable update for all users" ON "public"."bookings";

-- Create comprehensive RLS policies for bookings
CREATE POLICY "Enable all operations for bookings" ON "public"."bookings"
FOR ALL USING (true) WITH CHECK (true);

-- Ensure parking_spots can be updated
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."parking_spots";
DROP POLICY IF EXISTS "Enable update for all users" ON "public"."parking_spots";

CREATE POLICY "Enable all operations for parking_spots" ON "public"."parking_spots"
FOR ALL USING (true) WITH CHECK (true);