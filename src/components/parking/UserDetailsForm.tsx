import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, User, Phone, Mail, Car } from 'lucide-react';
import type { BookingFormData } from '@/types/parking';
import { useLanguage } from '@/hooks/useLanguage';

interface UserDetailsFormProps {
  onSubmit: (data: BookingFormData) => void;
  onBack: () => void;
}

export const UserDetailsForm = ({ onSubmit, onBack }: UserDetailsFormProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<BookingFormData>({
    user_name: '',
    contact_number: '',
    email: '',
    vehicle_type: '4wheeler',
    vehicle_number: ''
  });

  const [errors, setErrors] = useState<Partial<BookingFormData>>({});

  const validateForm = () => {
    const newErrors: Partial<BookingFormData> = {};

    if (!formData.user_name.trim()) {
      newErrors.user_name = 'Name is required';
    }

    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contact_number)) {
      newErrors.contact_number = 'Enter a valid 10-digit number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.vehicle_number.trim()) {
      newErrors.vehicle_number = 'Vehicle number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateFormData = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-elevated">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <User className="h-6 w-6" />
            {t('user_details_title')}
          </CardTitle>
          <p className="text-muted-foreground">{t('fill_information')}</p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="user_name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('full_name')}
              </Label>
              <Input
                id="user_name"
                value={formData.user_name}
                onChange={(e) => updateFormData('user_name', e.target.value)}
                placeholder={t('enter_full_name')}
                className={errors.user_name ? 'border-destructive' : ''}
              />
              {errors.user_name && (
                <p className="text-sm text-destructive">{errors.user_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_number" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t('contact_number')}
              </Label>
              <Input
                id="contact_number"
                value={formData.contact_number}
                onChange={(e) => updateFormData('contact_number', e.target.value)}
                placeholder={t('enter_contact_number')}
                maxLength={10}
                className={errors.contact_number ? 'border-destructive' : ''}
              />
              {errors.contact_number && (
                <p className="text-sm text-destructive">{errors.contact_number}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t('email_address')}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder={t('enter_email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                {t('vehicle_type')}
              </Label>
              <Select
                value={formData.vehicle_type}
                onValueChange={(value: '2wheeler' | '3wheeler' | '4wheeler') => 
                  updateFormData('vehicle_type', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2wheeler">2-Wheeler (Bike/Scooter)</SelectItem>
                  <SelectItem value="3wheeler">3-Wheeler (Auto/Rickshaw)</SelectItem>
                  <SelectItem value="4wheeler">4-Wheeler (Car/SUV)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle_number" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                {t('vehicle_number')}
              </Label>
              <Input
                id="vehicle_number"
                value={formData.vehicle_number}
                onChange={(e) => updateFormData('vehicle_number', e.target.value.toUpperCase())}
                placeholder={t('vehicle_placeholder')}
                className={errors.vehicle_number ? 'border-destructive' : ''}
              />
              {errors.vehicle_number && (
                <p className="text-sm text-destructive">{errors.vehicle_number}</p>
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
                {t('back')}
              </Button>
              <Button type="submit" className="flex-1">
                {t('next_verify')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};