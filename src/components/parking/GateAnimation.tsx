import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface GateAnimationProps {
  onComplete: () => void;
}

export const GateAnimation = ({ onComplete }: GateAnimationProps) => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStep(1), 500);
    const timer2 = setTimeout(() => setAnimationStep(2), 1500);
    const timer3 = setTimeout(() => setAnimationStep(3), 2500);
    const timer4 = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-parking-gate flex items-center justify-center">
      <Card className="max-w-md mx-auto shadow-elevated">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <CheckCircle className="mx-auto h-16 w-16 text-parking-available mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Granted</h2>
            <p className="text-gray-300">Welcome to Smart Parking</p>
          </div>

          {/* Gate Animation */}
          <div className="relative h-32 mb-6 bg-gray-700 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-sm">ENTRY GATE</div>
            </div>
            
            {/* Gate Barrier */}
            <div 
              className={`absolute bottom-0 w-full bg-red-500 transition-all duration-1000 ${
                animationStep >= 1 ? 'gate-opening' : 'h-2'
              }`}
              style={{
                transformOrigin: 'center bottom'
              }}
            />
            
            {/* Cars Animation */}
            <div className="absolute bottom-2 left-0 w-full">
              <div 
                className={`w-8 h-4 bg-blue-500 rounded transition-all duration-2000 ${
                  animationStep >= 2 ? 'transform translate-x-full' : ''
                }`}
              />
            </div>
          </div>

          <div className="space-y-2">
            {animationStep >= 0 && (
              <p className="text-parking-available text-sm">
                ✓ Identity Verified
              </p>
            )}
            {animationStep >= 1 && (
              <p className="text-parking-available text-sm">
                ✓ Gate Opening
              </p>
            )}
            {animationStep >= 2 && (
              <p className="text-parking-available text-sm">
                ✓ Access Granted
              </p>
            )}
            {animationStep >= 3 && (
              <p className="text-parking-available text-sm font-semibold">
                ✓ Welcome! Please proceed to your parking spot
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};