import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
interface AuthenticationStepProps {
  contactNumber: string;
  onSuccess: () => void;
  onBack: () => void;
}
export const AuthenticationStep = ({
  contactNumber,
  onSuccess,
  onBack
}: AuthenticationStepProps) => {
  const [phoneOtp, setPhoneOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [otpHash, setOtpHash] = useState('');
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    sendOtp();
  }, []);

  const sendOtp = async () => {
    setIsSending(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phoneNumber: contactNumber }
      });

      if (error) throw error;

      if (data?.success) {
        setOtpHash(data.otpHash);
      } else {
        throw new Error(data?.error || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('Send OTP error:', error);
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    if (!otpHash) {
      toast({
        title: "Send OTP First",
        description: "Please request an OTP before verifying",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { 
          phoneNumber: contactNumber,
          otp: phoneOtp,
          otpHash: otpHash
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Verification Successful",
          description: "Your phone number has been verified!"
        });
        onSuccess();
      } else {
        throw new Error(data?.error || 'Invalid OTP');
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Please enter the correct OTP",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };
  return <div className="max-w-2xl mx-auto">
      <Card className="shadow-elevated">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" />
            {t('verify_identity')}
          </CardTitle>
          <p className="text-muted-foreground">
            {t('verify_phone_secure')}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Phone Verification */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t('phone_verification')}
              </Label>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  {t('code_sent_to')}: <span className="font-medium">{contactNumber}</span>
                </p>
                <Input value={phoneOtp} onChange={e => setPhoneOtp(e.target.value)} placeholder={t('enter_otp')} maxLength={6} />
              </div>
            </div>

            
            

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1" disabled={isVerifying}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('back')}
              </Button>
              <Button onClick={handleVerify} className="flex-1" disabled={isVerifying || !phoneOtp}>
                {isVerifying ? t('verifying') : t('authenticate')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
