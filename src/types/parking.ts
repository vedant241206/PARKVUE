export interface ParkingSpot {
  id: number;
  spot_number: string;
  spot_type: 'normal' | 'vip' | 'ev_charging';
  is_occupied: boolean;
  floor_level: number;
  section: string;
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  user_name: string;
  contact_number: string;
  email: string;
  vehicle_type: '2wheeler' | '3wheeler' | '4wheeler';
  vehicle_number: string;
}

export interface Booking {
  id: string;
  user_name: string;
  contact_number: string;
  email: string;
  vehicle_type: '2wheeler' | '3wheeler' | '4wheeler';
  vehicle_number: string;
  spot_id: number;
  plan_type: 'normal' | 'vip' | 'ev_charging';
  payment_method: 'card' | 'online';
  payment_amount: number;
  entry_time: string;
  exit_time?: string;
  status: 'active' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface PlanOption {
  type: 'normal' | 'vip' | 'ev_charging';
  name: string;
  description: string;
  price: number;
  features: string[];
  icon: string;
}

export interface PaymentFormData {
  method: 'card' | 'online';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardHolder?: string;
  upiId?: string;
  netBankingBank?: string;
}