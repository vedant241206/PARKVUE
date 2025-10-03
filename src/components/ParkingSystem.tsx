import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Zap, Crown } from 'lucide-react';
import { UserDetailsForm } from './parking/UserDetailsForm';
import { ImageUploadStep } from './parking/ImageUploadStep';
import { AuthenticationStep } from './parking/AuthenticationStep';
import { PlanSelection } from './parking/PlanSelection';
import { PaymentStep } from './parking/PaymentStep';
import { ParkingReceipt } from './parking/ParkingReceipt';
import { GateAnimation } from './parking/GateAnimation';
import { ExitFlow } from './parking/ExitFlow';
import { AdminDashboard } from './parking/AdminDashboard';
import { AdminLogin } from './parking/AdminLogin';
import { LanguageSelector } from './parking/LanguageSelector';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import type { BookingFormData, PlanOption, PaymentFormData, ParkingSpot } from '@/types/parking';
export const ParkingSystem = () => {
  const [step, setStep] = useState<'entry' | 'imageUpload' | 'form' | 'auth' | 'plans' | 'payment' | 'receipt' | 'gate' | 'exit' | 'admin' | 'admin-login'>('entry');
  const [formData, setFormData] = useState<BookingFormData>({
    user_name: '',
    contact_number: '',
    email: '',
    vehicle_type: '4wheeler',
    vehicle_number: ''
  });
  const [detectedPlate, setDetectedPlate] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<PlanOption | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null);
  const [assignedSpot, setAssignedSpot] = useState<ParkingSpot | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [availableSpots, setAvailableSpots] = useState<ParkingSpot[]>([]);
  const { toast } = useToast();
  const { currentLanguage, changeLanguage, t } = useLanguage();
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
    
    // Set up real-time subscription for spot changes
    const subscription = supabase
      .channel('parking-spots-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parking_spots'
        },
        () => {
          fetchAvailableSpots();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
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
  const handleImageUploadSuccess = (numberPlate: string, vehicleType?: string) => {
    setDetectedPlate(numberPlate);
    setFormData(prev => ({ 
      ...prev, 
      vehicle_number: numberPlate,
      vehicle_type: vehicleType as '2wheeler' | '3wheeler' | '4wheeler' || prev.vehicle_type
    }));
    setStep('form');
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
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground py-6 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={changeLanguage} />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">PARKVUE</h1>
              <p className="text-lg opacity-90">{t('tagline')}</p>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <ExitFlow onComplete={resetSystem} onBack={() => setStep('entry')} />
        </div>
      </div>
    );
  }
  if (step === 'admin-login') {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground py-6 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={changeLanguage} />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">PARKVUE</h1>
              <p className="text-lg opacity-90">{t('tagline')}</p>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <AdminLogin onSuccess={() => setStep('admin')} onBack={() => setStep('entry')} />
        </div>
      </div>
    );
  }
  
  if (step === 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground py-6 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div></div>
              <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={changeLanguage} />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">PARKVUE</h1>
              <p className="text-lg opacity-90">{t('tagline')}</p>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <AdminDashboard onBack={() => setStep('entry')} />
        </div>
      </div>
    );
  }
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={changeLanguage} />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">PARKVUE</h1>
            <p className="text-lg opacity-90">{t('tagline')}</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {step === 'entry' && <div className="max-w-4xl mx-auto">
            <Card className="shadow-elevated">
              <CardContent className="p-8 text-center">
                <div className="mb-8">
                  <Car className="mx-auto mb-4 h-20 w-20 text-primary" />
                  <h2 className="text-3xl font-bold mb-4">{t('welcome')}</h2>
                  <p className="text-lg text-muted-foreground mb-8">{t('skip_hassle')}<br/>{t('time_not_wasted')}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="bg-parking-available/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl font-bold text-parking-available">{availableSpots.filter(s => s.spot_type === 'normal').length}</span>
                    </div>
                    <p className="font-semibold">{t('normal_spots')}</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-parking-vip/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl font-bold text-parking-vip">{availableSpots.filter(s => s.spot_type === 'vip').length}</span>
                    </div>
                    <p className="font-semibold">{t('vip_spots')}</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-parking-ev/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl font-bold text-parking-ev">{availableSpots.filter(s => s.spot_type === 'ev_charging').length}</span>
                    </div>
                    <p className="font-semibold">{t('ev_charging')}</p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button size="lg" onClick={() => setStep('imageUpload')} className="px-8">
                    {t('book_parking')}
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setStep('exit')} className="px-8">
                    {t('exit_parking')}
                  </Button>
                  <Button variant="secondary" size="lg" onClick={() => setStep('admin-login')} className="px-8">
                    {t('admin_dashboard')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>}

        {step === 'imageUpload' && <ImageUploadStep onSuccess={handleImageUploadSuccess} onBack={() => setStep('entry')} />}

        {step === 'form' && <UserDetailsForm onSubmit={handleFormSubmit} onBack={() => setStep('imageUpload')} initialVehicleNumber={detectedPlate} initialVehicleType={formData.vehicle_type} />}

        {step === 'auth' && <AuthenticationStep contactNumber={formData.contact_number} onSuccess={handleAuthSuccess} onBack={() => setStep('form')} />}

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