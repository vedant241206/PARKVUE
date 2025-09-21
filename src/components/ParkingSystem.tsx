import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Zap, Crown } from 'lucide-react';
import { UserDetailsForm } from './parking/UserDetailsForm';
import { AuthenticationStep } from './parking/AuthenticationStep';
import { PlanSelection } from './parking/PlanSelection';
import { PaymentStep } from './parking/PaymentStep';
import { ParkingReceipt } from './parking/ParkingReceipt';
import { GateAnimation } from './parking/GateAnimation';
import { ExitFlow } from './parking/ExitFlow';
import { AdminDashboard } from './parking/AdminDashboard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { BookingFormData, PlanOption, PaymentFormData, ParkingSpot } from '@/types/parking';
export const ParkingSystem = () => {
  const [step, setStep] = useState<'entry' | 'form' | 'auth' | 'plans' | 'payment' | 'receipt' | 'gate' | 'exit' | 'admin'>('entry');
  const [formData, setFormData] = useState<BookingFormData>({
    user_name: '',
    contact_number: '',
    email: '',
    vehicle_type: '4wheeler',
    vehicle_number: ''
  });
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null);
  const [assignedSpot, setAssignedSpot] = useState<ParkingSpot | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [availableSpots, setAvailableSpots] = useState<ParkingSpot[]>([]);
  const {
    toast
  } = useToast();
  const planOptions: PlanOption[] = [{
    type: 'normal',
    name: 'Normal Parking',
    description: 'Standard parking with basic facilities',
    price: 50,
    features: ['24/7 Security', 'CCTV Surveillance', 'Easy Access'],
    icon: 'car'
  }, {
    type: 'vip',
    name: 'VIP Parking',
    description: 'Premium parking with enhanced services',
    price: 120,
    features: ['Valet Service', 'Car Wash', 'Priority Access', 'Covered Parking'],
    icon: 'crown'
  }, {
    type: 'ev_charging',
    name: 'EV Charging',
    description: 'Electric vehicle parking with charging station',
    price: 80,
    features: ['Fast Charging', 'Eco-Friendly', 'Charging Cables Provided', 'Green Zone'],
    icon: 'zap'
  }];
  useEffect(() => {
    fetchAvailableSpots();
  }, []);
  const fetchAvailableSpots = async () => {
    const {
      data,
      error
    } = await supabase.from('parking_spots').select('*').eq('is_occupied', false).order('spot_number');
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch parking spots",
        variant: "destructive"
      });
    } else {
      setAvailableSpots(data as ParkingSpot[] || []);
    }
  };
  const assignParkingSpot = async (planType: string) => {
    const availableSpot = availableSpots.find(spot => spot.spot_type === planType);
    if (!availableSpot) {
      toast({
        title: "No spots available",
        description: `No ${planType} parking spots are currently available`,
        variant: "destructive"
      });
      return null;
    }

    // Update spot as occupied
    const {
      error: updateError
    } = await supabase.from('parking_spots').update({
      is_occupied: true
    }).eq('id', availableSpot.id);
    if (updateError) {
      toast({
        title: "Error",
        description: "Failed to assign parking spot",
        variant: "destructive"
      });
      return null;
    }
    return availableSpot;
  };
  const createBooking = async () => {
    if (!selectedPlan || !paymentData) return;
    const spot = await assignParkingSpot(selectedPlan.type);
    if (!spot) return;
    const {
      data,
      error
    } = await supabase.from('bookings').insert({
      user_name: formData.user_name,
      contact_number: formData.contact_number,
      email: formData.email,
      vehicle_type: formData.vehicle_type,
      vehicle_number: formData.vehicle_number,
      spot_id: spot.id,
      plan_type: selectedPlan.type,
      payment_method: paymentData.method,
      payment_amount: selectedPlan.price
    }).select().single();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive"
      });
    } else {
      setAssignedSpot(spot);
      setBookingId(data.id);
      setStep('receipt');
      fetchAvailableSpots(); // Refresh available spots
    }
  };
  const handleFormSubmit = (data: BookingFormData) => {
    setFormData(data);
    setStep('auth');
  };
  const handleAuthSuccess = () => {
    setStep('plans');
  };
  const handlePlanSelect = (plan: PlanOption) => {
    setSelectedPlan(plan);
    setStep('payment');
  };
  const handlePaymentComplete = (payment: PaymentFormData) => {
    setPaymentData(payment);
    createBooking();
  };
  const handleReceiptClose = () => {
    setStep('gate');
    setTimeout(() => {
      setStep('entry');
    }, 3000);
  };
  const resetSystem = () => {
    setStep('entry');
    setFormData({
      user_name: '',
      contact_number: '',
      email: '',
      vehicle_type: '4wheeler',
      vehicle_number: ''
    });
    setSelectedPlan(null);
    setPaymentData(null);
    setAssignedSpot(null);
    setBookingId(null);
  };
  if (step === 'gate') {
    return <GateAnimation onComplete={() => setStep('entry')} />;
  }
  if (step === 'exit') {
    return <ExitFlow onComplete={resetSystem} onBack={() => setStep('entry')} />;
  }
  if (step === 'admin') {
    return <AdminDashboard onBack={() => setStep('entry')} />;
  }
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">PARKVUE</h1>
          <p className="text-lg opacity-90">Find, Book & Park with Ease</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {step === 'entry' && <div className="max-w-4xl mx-auto">
            <Card className="shadow-elevated">
              <CardContent className="p-8 text-center">
                <div className="mb-8">
                  <Car className="mx-auto mb-4 h-20 w-20 text-primary" />
                  <h2 className="text-3xl font-bold mb-4">Welcome to PARKVUE</h2>
                  <p className="text-lg text-muted-foreground mb-8">Skip the hassle of finding parking. Get your spot assigned instantly!
Because time should not be wasted parking!</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="bg-parking-available/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl font-bold text-parking-available">{availableSpots.filter(s => s.spot_type === 'normal').length}</span>
                    </div>
                    <p className="font-semibold">Normal Spots</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-parking-vip/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl font-bold text-parking-vip">{availableSpots.filter(s => s.spot_type === 'vip').length}</span>
                    </div>
                    <p className="font-semibold">VIP Spots</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-parking-ev/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl font-bold text-parking-ev">{availableSpots.filter(s => s.spot_type === 'ev_charging').length}</span>
                    </div>
                    <p className="font-semibold">EV Charging</p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button size="lg" onClick={() => setStep('form')} className="px-8">
                    Book Parking Spot
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setStep('exit')} className="px-8">
                    Exit Parking
                  </Button>
                  <Button variant="secondary" size="lg" onClick={() => setStep('admin')} className="px-8">
                    Admin Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>}

        {step === 'form' && <UserDetailsForm onSubmit={handleFormSubmit} onBack={() => setStep('entry')} />}

        {step === 'auth' && <AuthenticationStep contactNumber={formData.contact_number} email={formData.email} onSuccess={handleAuthSuccess} onBack={() => setStep('form')} />}

        {step === 'plans' && <PlanSelection plans={planOptions} availableSpots={availableSpots} onSelect={handlePlanSelect} onBack={() => setStep('auth')} />}

        {step === 'payment' && selectedPlan && <PaymentStep plan={selectedPlan} onComplete={handlePaymentComplete} onBack={() => setStep('plans')} />}

        {step === 'receipt' && assignedSpot && selectedPlan && <ParkingReceipt booking={{
        id: bookingId!,
        user_name: formData.user_name,
        contact_number: formData.contact_number,
        email: formData.email,
        vehicle_type: formData.vehicle_type,
        vehicle_number: formData.vehicle_number,
        spot_id: assignedSpot.id,
        plan_type: selectedPlan.type,
        payment_method: paymentData!.method,
        payment_amount: selectedPlan.price,
        entry_time: new Date().toISOString(),
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }} spot={assignedSpot} plan={selectedPlan} onClose={handleReceiptClose} />}
      </div>
    </div>;
};