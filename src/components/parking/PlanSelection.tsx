import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Car, Crown, Zap, Check } from 'lucide-react';
import type { PlanOption, ParkingSpot } from '@/types/parking';

interface PlanSelectionProps {
  plans: PlanOption[];
  availableSpots: ParkingSpot[];
  onSelect: (plan: PlanOption) => void;
  onBack: () => void;
}

export const PlanSelection = ({ plans, availableSpots, onSelect, onBack }: PlanSelectionProps) => {
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

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-elevated mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Choose Your Parking Plan</CardTitle>
          <p className="text-muted-foreground">Select the plan that best suits your needs</p>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => {
          const Icon = getIcon(plan.icon);
          const availableCount = getAvailableCount(plan.type);
          const isAvailable = availableCount > 0;

          return (
            <Card 
              key={plan.type} 
              className={`shadow-card transition-all duration-300 hover:shadow-elevated ${
                isAvailable ? 'hover:scale-105' : 'opacity-60'
              }`}
            >
              <CardHeader className="text-center">
                <div className={`mx-auto mb-4 ${getPlanColor(plan.type)}`}>
                  <Icon className="h-12 w-12" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant={isAvailable ? "default" : "destructive"}>
                    {availableCount} spots available
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <span className="text-3xl font-bold">₹{plan.price}</span>
                  <span className="text-muted-foreground">/session</span>
                </div>

                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-parking-available" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full"
                  onClick={() => onSelect(plan)}
                  disabled={!isAvailable}
                  variant={plan.type === 'vip' ? 'default' : 'outline'}
                >
                  {isAvailable ? 'Select Plan' : 'Not Available'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Authentication
        </Button>
      </div>
    </div>
  );
};