import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface GateAnimationProps {
  onComplete: () => void;
}

export const GateAnimation = ({ onComplete }: GateAnimationProps) => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStep(1), 1000);
    const timer2 = setTimeout(() => setAnimationStep(2), 3000);
    const timer3 = setTimeout(() => setAnimationStep(3), 5000);
    const timer4 = setTimeout(() => onComplete(), 7000);

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

          {/* Modern Sliding Gate Animation */}
          <div className="relative h-40 mb-6 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden border-4 border-slate-600 shadow-2xl">
            {/* Control Panel */}
            <div className="absolute top-2 left-2 right-2 h-8 bg-slate-950 rounded flex items-center justify-between px-3">
              <div className="text-green-400 text-xs font-bold tracking-wider">SMART GATE SYSTEM</div>
              <div className="flex gap-1">
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${animationStep >= 1 ? 'bg-green-400 shadow-green-400 shadow-lg' : 'bg-red-500 shadow-red-500 shadow-lg'}`}></div>
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${animationStep >= 2 ? 'bg-blue-400 shadow-blue-400 shadow-lg' : 'bg-gray-600'}`}></div>
              </div>
            </div>
            
            {/* Gate Columns */}
            <div className="absolute bottom-0 left-4 w-4 h-24 bg-gradient-to-t from-slate-700 to-slate-600 rounded-t-lg"></div>
            <div className="absolute bottom-0 right-4 w-4 h-24 bg-gradient-to-t from-slate-700 to-slate-600 rounded-t-lg"></div>
            
            {/* Sliding Gate Panels */}
            <div 
              className={`absolute bottom-8 left-6 w-20 h-16 bg-gradient-to-r from-orange-600 to-red-500 transition-all duration-4000 ease-out rounded-r-lg ${
                animationStep >= 1 ? 'transform -translate-x-20 opacity-80' : ''
              }`}
              style={{
                boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.1)'
              }}
            >
              <div className="absolute inset-2 border-2 border-orange-300 rounded opacity-60"></div>
              <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-400 rounded-full"></div>
            </div>
            
            <div 
              className={`absolute bottom-8 right-6 w-20 h-16 bg-gradient-to-l from-orange-600 to-red-500 transition-all duration-4000 ease-out rounded-l-lg ${
                animationStep >= 1 ? 'transform translate-x-20 opacity-80' : ''
              }`}
              style={{
                boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.1)'
              }}
            >
              <div className="absolute inset-2 border-2 border-orange-300 rounded opacity-60"></div>
              <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full"></div>
            </div>
            
            {/* Road Surface with Motion Lights */}
            <div className="absolute bottom-0 w-full h-8 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600">
              <div className={`w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mt-3 transition-all duration-1000 ${
                animationStep >= 1 ? 'opacity-100 animate-pulse' : 'opacity-50'
              }`}></div>
              {/* Motion sensor lights */}
              <div className="absolute top-1 left-8 flex gap-2">
                {[0,1,2,3,4].map((i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 rounded-full transition-all duration-300 ${
                      animationStep >= 1 && animationStep >= i/2 ? 'bg-cyan-400 shadow-cyan-400 shadow-lg' : 'bg-gray-700'
                    }`}
                    style={{ transitionDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
            </div>
            
            {/* Vehicle Animation */}
            <div className="absolute bottom-4 left-2">
              <div 
                className={`w-16 h-8 bg-gradient-to-r from-indigo-600 to-purple-500 rounded-lg transition-all duration-5000 ease-in-out flex items-center justify-center shadow-lg ${
                  animationStep >= 2 ? 'transform translate-x-80 scale-105' : ''
                }`}
                style={{
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}
              >
                <div className="text-white text-lg">🚗</div>
                <div className={`absolute -bottom-1 left-2 w-2 h-2 bg-gray-800 rounded-full transition-all duration-5000 ${
                  animationStep >= 2 ? 'animate-spin' : ''
                }`}></div>
                <div className={`absolute -bottom-1 right-2 w-2 h-2 bg-gray-800 rounded-full transition-all duration-5000 ${
                  animationStep >= 2 ? 'animate-spin' : ''
                }`}></div>
              </div>
            </div>
            
            {/* Status Display */}
            <div className="absolute top-14 left-1/2 transform -translate-x-1/2">
              <div className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-500 ${
                animationStep >= 1 
                  ? 'bg-green-600 text-white shadow-green-500 shadow-lg' 
                  : 'bg-red-600 text-white shadow-red-500 shadow-lg'
              }`}>
                {animationStep >= 1 ? '✓ ACCESS GRANTED' : '⚠ VERIFYING...'}
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