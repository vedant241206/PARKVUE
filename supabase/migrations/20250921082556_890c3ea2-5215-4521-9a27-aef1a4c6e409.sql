-- Create parking spots table
CREATE TABLE public.parking_spots (
  id SERIAL PRIMARY KEY,
  spot_number VARCHAR(10) NOT NULL UNIQUE,
  spot_type VARCHAR(20) NOT NULL CHECK (spot_type IN ('normal', 'vip', 'ev_charging')),
  is_occupied BOOLEAN NOT NULL DEFAULT FALSE,
  floor_level INTEGER NOT NULL DEFAULT 1,
  section VARCHAR(10) NOT NULL DEFAULT 'A',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  contact_number VARCHAR(15) NOT NULL,
  email VARCHAR(100) NOT NULL,
  vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('2wheeler', '3wheeler', '4wheeler')),
  vehicle_number VARCHAR(20) NOT NULL,
  spot_id INTEGER NOT NULL REFERENCES public.parking_spots(id),
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('normal', 'vip', 'ev_charging')),
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('card', 'online')),
  payment_amount DECIMAL(10,2) NOT NULL,
  entry_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  exit_time TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.parking_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public parking system)
CREATE POLICY "Anyone can view parking spots" 
ON public.parking_spots 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update parking spots" 
ON public.parking_spots 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can view bookings" 
ON public.bookings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update bookings" 
ON public.bookings 
FOR UPDATE 
USING (true);

-- Insert initial parking spots
INSERT INTO public.parking_spots (spot_number, spot_type, floor_level, section) VALUES
-- Normal spots
('A1-001', 'normal', 1, 'A'),
('A1-002', 'normal', 1, 'A'),
('A1-003', 'normal', 1, 'A'),
('A1-004', 'normal', 1, 'A'),
('A1-005', 'normal', 1, 'A'),
('A1-006', 'normal', 1, 'A'),
('A1-007', 'normal', 1, 'A'),
('A1-008', 'normal', 1, 'A'),
('A1-009', 'normal', 1, 'A'),
('A1-010', 'normal', 1, 'A'),
('B1-001', 'normal', 1, 'B'),
('B1-002', 'normal', 1, 'B'),
('B1-003', 'normal', 1, 'B'),
('B1-004', 'normal', 1, 'B'),
('B1-005', 'normal', 1, 'B'),
-- VIP spots
('V1-001', 'vip', 1, 'V'),
('V1-002', 'vip', 1, 'V'),
('V1-003', 'vip', 1, 'V'),
('V1-004', 'vip', 1, 'V'),
('V1-005', 'vip', 1, 'V'),
-- EV Charging spots
('E1-001', 'ev_charging', 1, 'E'),
('E1-002', 'ev_charging', 1, 'E'),
('E1-003', 'ev_charging', 1, 'E'),
('E1-004', 'ev_charging', 1, 'E'),
('E1-005', 'ev_charging', 1, 'E');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_parking_spots_updated_at
BEFORE UPDATE ON public.parking_spots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live updates
ALTER TABLE public.parking_spots REPLICA IDENTITY FULL;
ALTER TABLE public.bookings REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.parking_spots;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;