import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { PlanOption, PaymentFormData } from '@/types/parking';

interface PaymentStepProps {
  plan: PlanOption;
  onComplete: (paymentData: PaymentFormData) => void;
  onBack: () => void;
}

export const PaymentStep = ({ plan, onComplete, onBack }: PaymentStepProps) => {
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    upiId: '',
    netBankingBank: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: `₹${plan.price} has been charged successfully!`,
      });
      onComplete(paymentData);
      setIsProcessing(false);
    }, 2000);
  };

  const updatePaymentData = (field: keyof PaymentFormData, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-elevated mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Payment Details</CardTitle>
          <p className="text-muted-foreground">Complete your booking payment</p>
        </CardHeader>
      </Card>

      {/* Order Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <span>{plan.name}</span>
            <span>₹{plan.price}</span>
          </div>
          <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
            <span>Service Charge</span>
            <span>₹10</span>
          </div>
          <div className="border-t pt-2 flex justify-between items-center font-bold">
            <span>Total Amount</span>
            <span>₹{plan.price + 10}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elevated">
        <CardContent className="p-6">
          <Tabs value={paymentData.method} onValueChange={(value) => updatePaymentData('method', value as 'card' | 'online')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="card" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Card Payment
              </TabsTrigger>
              <TabsTrigger value="online" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Online Payment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="card" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={(e) => updatePaymentData('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={(e) => updatePaymentData('expiryDate', e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={paymentData.cvv}
                    onChange={(e) => updatePaymentData('cvv', e.target.value)}
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardHolder">Cardholder Name</Label>
                <Input
                  id="cardHolder"
                  value={paymentData.cardHolder}
                  onChange={(e) => updatePaymentData('cardHolder', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
            </TabsContent>

            <TabsContent value="online" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Choose Payment Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">UPI Payment</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                      <SelectItem value="wallet">Digital Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID (Optional)</Label>
                  <Input
                    id="upiId"
                    value={paymentData.upiId}
                    onChange={(e) => updatePaymentData('upiId', e.target.value)}
                    placeholder="yourname@upi"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Demo Mode:</strong> All payment methods will work in demo mode. No actual charges will be made.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 pt-6">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1"
              disabled={isProcessing}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handlePayment}
              className="flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay ₹${plan.price + 10}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};