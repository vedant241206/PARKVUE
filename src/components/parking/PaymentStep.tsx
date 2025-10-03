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
import { useLanguage } from '@/hooks/useLanguage';

interface PaymentStepProps {
  plan: PlanOption;
  onComplete: (paymentData: PaymentFormData) => void;
  onBack: () => void;
}
export const PaymentStep = ({
  plan,
  onComplete,
  onBack
}: PaymentStepProps) => {
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
  const { t } = useLanguage();
  const handlePayment = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isProcessing) return; // Prevent double clicks
    
    setIsProcessing(true);
    
    // Validate payment details based on method
    if (paymentData.method === 'card') {
      if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardHolder) {
        toast({
          title: t('payment_details_required'),
          description: t('fill_card_details'),
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }
    } else if (paymentData.method === 'online') {
      if (!paymentData.netBankingBank) {
        toast({
          title: t('payment_method_required'), 
          description: t('select_payment_or_upi'),
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }
      if (paymentData.netBankingBank === 'upi' && !paymentData.upiId) {
        toast({
          title: t('payment_details_required'), 
          description: t('provide_upi_netbanking'),
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }
    }

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: t('payment_successful'),
        description: `₹${plan.price + 10} ${t('payment_charged')}`
      });
      
      setIsProcessing(false);
      onComplete(paymentData);
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: t('payment_failed'),
        description: t('payment_error'),
        variant: "destructive"
      });
    }
  };
  const updatePaymentData = (field: keyof PaymentFormData, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return <div className="max-w-2xl mx-auto">
      <Card className="shadow-elevated mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('payment_details')}</CardTitle>
          <p className="text-muted-foreground">{t('complete_payment')}</p>
        </CardHeader>
      </Card>

      {/* Order Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{t('order_summary')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <span>{plan.name}</span>
            <span>₹{plan.price}</span>
          </div>
          <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
            <span>{t('service_charge')}</span>
            <span>₹10</span>
          </div>
          <div className="border-t pt-2 flex justify-between items-center font-bold">
            <span>{t('total_amount')}</span>
            <span>₹{plan.price + 10}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elevated">
        <CardContent className="p-6">
          <Tabs value={paymentData.method} onValueChange={value => updatePaymentData('method', value as 'card' | 'online')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="card" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {t('card_payment')}
              </TabsTrigger>
              <TabsTrigger value="online" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                {t('online_payment')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="card" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">{t('card_number')}</Label>
                <Input id="cardNumber" value={paymentData.cardNumber} onChange={e => updatePaymentData('cardNumber', e.target.value)} placeholder="1234 5678 9012 3456" maxLength={19} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">{t('expiry_date')}</Label>
                  <Input id="expiryDate" value={paymentData.expiryDate} onChange={e => updatePaymentData('expiryDate', e.target.value)} placeholder="MM/YY" maxLength={5} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">{t('cvv')}</Label>
                  <Input id="cvv" value={paymentData.cvv} onChange={e => updatePaymentData('cvv', e.target.value)} placeholder="123" maxLength={3} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardHolder">{t('cardholder_name')}</Label>
                <Input id="cardHolder" value={paymentData.cardHolder} onChange={e => updatePaymentData('cardHolder', e.target.value)} placeholder="John Doe" />
              </div>
            </TabsContent>

            <TabsContent value="online" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('choose_payment_method')}</Label>
                  <Select value={paymentData.netBankingBank} onValueChange={value => updatePaymentData('netBankingBank', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder={t('select_payment_method')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">{t('upi_payment')}</SelectItem>
                      <SelectItem value="sbi">{t('state_bank_india')}</SelectItem>
                      <SelectItem value="hdfc">{t('hdfc_bank')}</SelectItem>
                      <SelectItem value="icici">{t('icici_bank')}</SelectItem>
                      <SelectItem value="axis">{t('axis_bank')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentData.netBankingBank === 'upi' && (
                  <div className="space-y-2">
                    <Label htmlFor="upiId">{t('upi_id')}</Label>
                    <Input id="upiId" value={paymentData.upiId} onChange={e => updatePaymentData('upiId', e.target.value)} placeholder="yourname@upi" />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 pt-6">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1" disabled={isProcessing}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('back')}
            </Button>
            <Button type="button" onClick={handlePayment} className="flex-1" disabled={isProcessing}>
              {isProcessing ? t('processing') : `${t('pay_now')} ₹${plan.price + 10}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
};