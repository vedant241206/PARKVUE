import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, LogOut, Phone, Car, Upload, Camera, X } from 'lucide-react';
import { GateAnimation } from './GateAnimation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Booking } from '@/types/parking';

interface ExitFlowProps {
  onComplete: () => void;
  onBack: () => void;
}

export const ExitFlow = ({ onComplete, onBack }: ExitFlowProps) => {
  const [step, setStep] = useState<'image' | 'verify' | 'confirm' | 'gate'>('image');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [contactNumber, setContactNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = useCallback(async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      toast({
        title: "Image Uploaded",
        description: "Vehicle image captured successfully"
      });
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

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
      {step === 'image' && (
        <Card className="shadow-elevated">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Camera className="h-6 w-6" />
              Upload Vehicle Image
            </CardTitle>
            <p className="text-muted-foreground">
              Take a photo of your vehicle for exit verification
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                } ${uploadedImage ? 'border-parking-available' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                {uploadedImage ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={uploadedImage}
                        alt="Uploaded vehicle"
                        className="max-h-64 rounded-lg"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2"
                        onClick={() => setUploadedImage(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Image uploaded successfully
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-lg font-medium mb-2">
                        Drag & drop your vehicle image here
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        or click the button below to browse
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Select Image
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('verify')}
                  className="flex-1"
                >
                  Do it Manually
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    if (!uploadedImage) {
                      toast({
                        title: "Image Required",
                        description: "Please upload a vehicle image first",
                        variant: "destructive"
                      });
                      return;
                    }
                    setStep('verify');
                  }}
                  className="flex-1"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                  onClick={() => setStep('image')}
                  className="flex-1"
                  disabled={isVerifying}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
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