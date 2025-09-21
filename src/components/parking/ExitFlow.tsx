import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, LogOut, Phone, Car } from 'lucide-react';
import { GateAnimation } from './GateAnimation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Booking } from '@/types/parking';

interface ExitFlowProps {
  onComplete: () => void;
  onBack: () => void;
}

export const ExitFlow = ({ onComplete, onBack }: ExitFlowProps) => {
  const [step, setStep] = useState<'verify' | 'confirm' | 'gate'>('verify');
  const [contactNumber, setContactNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!contactNumber || !vehicleNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter both contact number and vehicle number",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          parking_spots (*)
        `)
        .eq('contact_number', contactNumber)
        .eq('vehicle_number', vehicleNumber.toUpperCase())
        .eq('status', 'active')
        .single();

      if (error || !data) {
        toast({
          title: "Booking Not Found",
          description: "No active booking found with these details",
          variant: "destructive"
        });
      } else {
        setBooking(data as Booking);
        setStep('confirm');
        toast({
          title: "Booking Found",
          description: "Your parking session has been verified",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify booking details",
        variant: "destructive"
      });
    }

    setIsVerifying(false);
  };

  const handleExit = async () => {
    if (!booking) return;

    try {
      // Update booking status to completed
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          status: 'completed',
          exit_time: new Date().toISOString()
        })
        .eq('id', booking.id);

      if (bookingError) throw bookingError;

      // Free up the parking spot
      const { error: spotError } = await supabase
        .from('parking_spots')
        .update({ is_occupied: false })
        .eq('id', booking.spot_id);

      if (spotError) throw spotError;

      toast({
        title: "Exit Successful",
        description: "Thank you for using Smart Parking!",
      });

      setStep('gate');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process exit",
        variant: "destructive"
      });
    }
  };

  if (step === 'gate') {
    return <GateAnimation onComplete={onComplete} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {step === 'verify' && (
        <Card className="shadow-elevated">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <LogOut className="h-6 w-6" />
              Exit Parking
            </CardTitle>
            <p className="text-muted-foreground">
              Please verify your details to exit the parking area
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="contactNumber" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Number
                </Label>
                <Input
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Enter your registered contact number"
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleNumber" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Vehicle Number
                </Label>
                <Input
                  id="vehicleNumber"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="Enter your vehicle number"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                  disabled={isVerifying}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'Verify & Exit'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 'confirm' && booking && (
        <Card className="shadow-elevated">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Confirm Your Exit</CardTitle>
            <p className="text-muted-foreground">Review your parking session details</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Parking Session Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Parking Spot</p>
                    <p className="font-medium text-xl">{(booking as any).parking_spots?.spot_number}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vehicle</p>
                    <p className="font-medium">{booking.vehicle_number}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Entry Time</p>
                    <p className="font-medium">
                      {new Date(booking.entry_time).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">
                      {Math.round((Date.now() - new Date(booking.entry_time).getTime()) / (1000 * 60))} mins
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-parking-available/10 p-4 rounded-lg border border-parking-available/20">
                <p className="text-parking-available font-semibold">✓ Booking Verified Successfully</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your parking spot will be marked as available after exit
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep('verify')}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleExit}
                  className="flex-1"
                >
                  Confirm Exit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};