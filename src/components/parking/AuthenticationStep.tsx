import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthenticationStepProps {
  contactNumber: string;
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const AuthenticationStep = ({ contactNumber, email, onSuccess, onBack }: AuthenticationStepProps) => {
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    setIsVerifying(true);
    
    // Simulate verification delay
    setTimeout(() => {
      if (phoneOtp === '123456' && emailOtp === '123456') {
        toast({
          title: "Verification Successful",
          description: "Your identity has been verified successfully!",
        });
        onSuccess();
      } else {
        toast({
          title: "Verification Failed",
          description: "Please enter the correct OTP (123456) for both phone and email",
          variant: "destructive"
        });
      }
      setIsVerifying(false);
    }, 1500);
  };

  const sendOtp = (type: 'phone' | 'email') => {
    toast({
      title: "OTP Sent",
      description: `Verification code sent to your ${type}. Use 123456 for demo.`,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-elevated">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" />
            Verify Your Identity
          </CardTitle>
          <p className="text-muted-foreground">
            We've sent verification codes to secure your booking
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Phone Verification */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Verification
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendOtp('phone')}
                >
                  Send OTP
                </Button>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Code sent to: <span className="font-medium">{contactNumber}</span>
                </p>
                <Input
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP (123456)"
                  maxLength={6}
                />
              </div>
            </div>

            {/* Email Verification */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Verification
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendOtp('email')}
                >
                  Send OTP
                </Button>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Code sent to: <span className="font-medium">{email}</span>
                </p>
                <Input
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP (123456)"
                  maxLength={6}
                />
              </div>
            </div>

            {/* Demo Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Demo Mode:</strong> Use <code className="bg-blue-100 px-1 rounded">123456</code> as OTP for both phone and email verification.
              </p>
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
                Back
              </Button>
              <Button
                onClick={handleVerify}
                className="flex-1"
                disabled={isVerifying || !phoneOtp || !emailOtp}
              >
                {isVerifying ? 'Verifying...' : 'Authenticate'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};