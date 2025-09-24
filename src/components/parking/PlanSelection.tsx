import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Car, Crown, Zap, Check } from 'lucide-react';
import type { PlanOption, ParkingSpot } from '@/types/parking';
import { useLanguage } from '@/hooks/useLanguage';

interface PlanSelectionProps {
  plans: PlanOption[];
  availableSpots: ParkingSpot[];
  onSelect: (plan: PlanOption) => void;
  onBack: () => void;
}
export const PlanSelection = ({
  plans,
  availableSpots,
  onSelect,
  onBack
}: PlanSelectionProps) => {
  const { t } = useLanguage();
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'car':
        return Car;
      case 'crown':
        return Crown;
      case 'zap':
        return Zap;
      default:
        return Car;
    }
  };
  const getAvailableCount = (planType: string) => {
    return availableSpots.filter(spot => spot.spot_type === planType).length;
  };
  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'normal':
        return 'text-parking-available';
      case 'vip':
        return 'text-parking-vip';
      case 'ev_charging':
        return 'text-parking-ev';
      default:
        return 'text-primary';
    }
  };
  return <div className="max-w-6xl mx-auto">
      <Card className="shadow-elevated mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('choose_plan')}</CardTitle>
          <p className="text-muted-foreground">{t('select_best_plan')}</p>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map(plan => {
        const Icon = getIcon(plan.icon);
        const availableCount = getAvailableCount(plan.type);
        const isAvailable = availableCount > 0;
        return <Card key={plan.type} className={`shadow-card transition-all duration-300 hover:shadow-elevated ${isAvailable ? 'hover:scale-105' : 'opacity-60'} border-2 hover:border-primary/20`}>
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto mb-4 ${getPlanColor(plan.type)}`}>
                  <Icon className="h-12 w-12" />
                </div>
                <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                <p className="text-muted-foreground text-sm mb-3">{plan.description}</p>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant={isAvailable ? "default" : "destructive"}>
                    {availableCount} {t('spots_available')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="text-center py-2 bg-muted/30 rounded-lg">
                  <span className="text-3xl font-bold text-primary">₹{plan.price}</span>
                  <span className="text-muted-foreground text-sm block">/session</span>
                </div>

                <div className="space-y-2 min-h-[120px]">
                  {plan.features.map((feature, index) => <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-parking-available flex-shrink-0" />
                      <span>{feature}</span>
                    </div>)}
                </div>

                <Button 
                  onClick={() => onSelect(plan)} 
                  disabled={!isAvailable} 
                  className="w-full h-12 font-semibold transition-all duration-200 hover:scale-105"
                  variant={isAvailable ? "default" : "secondary"}
                >
                  {isAvailable ? t('select_plan') : t('not_available')}
                </Button>
              </CardContent>
            </Card>;
      })}
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </Button>
      </div>
    </div>;
};