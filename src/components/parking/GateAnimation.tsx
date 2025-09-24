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

          {/* Realistic Gate Animation */}
          <div className="relative h-40 mb-6 bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg overflow-hidden border-4 border-gray-500">
            {/* Gate Frame */}
            <div className="absolute inset-0">
              <div className="absolute top-2 left-2 right-2 h-6 bg-gray-900 rounded flex items-center justify-center">
                <div className="text-green-400 text-xs font-bold tracking-wider">AUTHORIZED ACCESS</div>
              </div>
              
              {/* Traffic Light */}
              <div className="absolute top-3 right-4 flex gap-1">
                <div className={`w-2 h-2 rounded-full ${animationStep >= 1 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                <div className={`w-2 h-2 rounded-full ${animationStep === 0 ? 'bg-red-500' : 'bg-gray-600'}`}></div>
              </div>
            </div>
            
            {/* Left Gate Barrier */}
            <div 
              className={`absolute bottom-0 left-0 w-1/2 h-3 bg-gradient-to-r from-red-600 to-red-500 transition-all duration-2000 ease-out ${
                animationStep >= 1 ? 'transform -rotate-90 -translate-x-6 -translate-y-6' : ''
              }`}
              style={{
                transformOrigin: 'left bottom',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            />
            
            {/* Right Gate Barrier */}
            <div 
              className={`absolute bottom-0 right-0 w-1/2 h-3 bg-gradient-to-l from-red-600 to-red-500 transition-all duration-2000 ease-out ${
                animationStep >= 1 ? 'transform rotate-90 translate-x-6 -translate-y-6' : ''
              }`}
              style={{
                transformOrigin: 'right bottom',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            />
            
            {/* Road Surface */}
            <div className="absolute bottom-0 w-full h-8 bg-gray-400">
              <div className="w-full h-1 bg-yellow-300 mt-3"></div>
            </div>
            
            {/* Car Animation */}
            <div className="absolute bottom-4 left-4">
              <div 
                className={`w-12 h-6 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg transition-all duration-2500 flex items-center justify-center ${
                  animationStep >= 2 ? 'transform translate-x-96' : ''
                }`}
                style={{
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                <div className="text-white text-xs">🚗</div>
              </div>
            </div>
            
            {/* Entrance Sign */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
              <div className="bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold">
                ENTRY GATE
              </div>
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