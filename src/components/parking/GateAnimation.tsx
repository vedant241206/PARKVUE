import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Zap, Shield } from 'lucide-react';

interface GateAnimationProps {
  onComplete: () => void;
}

export const GateAnimation = ({ onComplete }: GateAnimationProps) => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStep(1), 1500);
    const timer2 = setTimeout(() => setAnimationStep(2), 4000);
    const timer3 = setTimeout(() => setAnimationStep(3), 7000);
    const timer4 = setTimeout(() => setAnimationStep(4), 9000);
    const timer5 = setTimeout(() => onComplete(), 12000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="max-w-lg mx-auto shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <div className="relative">
              <Shield className="mx-auto h-16 w-16 text-green-400 mb-4 animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Access Granted
            </h2>
            <p className="text-blue-200">Smart Parking Gateway</p>
          </div>

          {/* Futuristic Barrier Gate Animation */}
          <div className="relative h-48 mb-6 bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl">
            
            {/* Holographic Grid Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                {Array.from({length: 48}).map((_, i) => (
                  <div 
                    key={i} 
                    className={`border border-cyan-400/30 transition-all duration-1000 ${
                      animationStep >= 1 ? 'border-cyan-400/60 bg-cyan-400/10' : ''
                    }`}
                    style={{ transitionDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>
            </div>

            {/* Control Interface */}
            <div className="absolute top-3 left-3 right-3 h-10 bg-black/80 rounded-lg border border-green-400/50 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-xs font-mono tracking-wider">QUANTUM BARRIER v2.1</span>
              </div>
              <div className="flex gap-2">
                <div className={`w-2 h-2 rounded-full transition-all duration-700 ${
                  animationStep >= 1 ? 'bg-green-400 shadow-green-400/50 shadow-lg animate-pulse' : 'bg-red-500 shadow-red-500/50 shadow-lg'
                }`}></div>
                <div className={`w-2 h-2 rounded-full transition-all duration-700 ${
                  animationStep >= 2 ? 'bg-blue-400 shadow-blue-400/50 shadow-lg animate-pulse' : 'bg-gray-600'
                }`}></div>
                <div className={`w-2 h-2 rounded-full transition-all duration-700 ${
                  animationStep >= 3 ? 'bg-purple-400 shadow-purple-400/50 shadow-lg animate-pulse' : 'bg-gray-600'
                }`}></div>
              </div>
            </div>
            
            {/* Barrier Arm */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
              <div className="relative w-32 h-4">
                {/* Barrier Pivot */}
                <div className="absolute left-0 w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full border-2 border-gray-400 flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                
                {/* Barrier Arm */}
                <div 
                  className={`absolute left-6 w-24 h-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-r-lg transition-all duration-3000 ease-out origin-left shadow-lg ${
                    animationStep >= 2 ? 'transform rotate-90 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500' : ''
                  }`}
                  style={{
                    boxShadow: animationStep >= 2 ? 
                      '0 0 20px rgba(34, 197, 94, 0.6), 0 0 40px rgba(59, 130, 246, 0.4)' : 
                      '0 0 20px rgba(239, 68, 68, 0.6)'
                  }}
                >
                  {/* Energy Strips */}
                  <div className="absolute inset-1 border border-white/30 rounded"></div>
                  <div className="absolute top-1 left-2 right-2 h-0.5 bg-white/50 rounded"></div>
                  <div className="absolute bottom-1 left-2 right-2 h-0.5 bg-white/50 rounded"></div>
                </div>

                {/* Holographic Warning */}
                {animationStep < 2 && (
                  <div className="absolute -top-8 left-8 text-red-400 text-xs font-mono animate-pulse">
                    ⚠ BARRIER ACTIVE
                  </div>
                )}
              </div>
            </div>
            
            {/* Ground Sensors */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex justify-between items-center">
                {[0,1,2,3,4].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      animationStep >= 1 && animationStep >= i/2 ? 
                        'bg-cyan-400 shadow-cyan-400/50 shadow-lg animate-pulse' : 
                        'bg-gray-700'
                    }`}
                    style={{ transitionDelay: `${i * 300}ms` }}
                  />
                ))}
              </div>
              
              {/* Scanning Line */}
              <div className={`mt-2 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-all duration-2000 ${
                animationStep >= 1 ? 'opacity-100 animate-pulse' : 'opacity-30'
              }`}></div>
            </div>
            
            {/* Vehicle Detection Zone */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div 
                className={`w-20 h-10 rounded-lg transition-all duration-4000 ease-in-out flex items-center justify-center ${
                  animationStep >= 3 ? 
                    'transform translate-y-16 scale-110 bg-gradient-to-r from-blue-500 to-purple-600' : 
                    'bg-gradient-to-r from-indigo-600 to-purple-700'
                }`}
                style={{
                  boxShadow: animationStep >= 3 ? 
                    '0 8px 32px rgba(59, 130, 246, 0.6), 0 0 20px rgba(147, 51, 234, 0.4)' :
                    '0 4px 16px rgba(99, 102, 241, 0.4)'
                }}
              >
                <span className="text-white text-xl">🚗</span>
                
                {/* Wheels */}
                <div className={`absolute -bottom-1 left-2 w-2 h-2 bg-gray-800 rounded-full transition-all duration-4000 ${
                  animationStep >= 3 ? 'animate-spin' : ''
                }`}></div>
                <div className={`absolute -bottom-1 right-2 w-2 h-2 bg-gray-800 rounded-full transition-all duration-4000 ${
                  animationStep >= 3 ? 'animate-spin' : ''
                }`}></div>
                
                {/* Vehicle Glow */}
                {animationStep >= 3 && (
                  <div className="absolute inset-0 bg-white/20 rounded-lg animate-pulse"></div>
                )}
              </div>
              
              {/* Motion Trail */}
              {animationStep >= 3 && (
                <div className="absolute top-2 -left-8 w-4 h-6 bg-gradient-to-r from-blue-400/60 to-transparent rounded-l-full animate-pulse"></div>
              )}
            </div>
            
            {/* Status Display */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
              <div className={`px-6 py-2 rounded-full text-xs font-mono font-bold transition-all duration-1000 border-2 ${
                animationStep >= 2 
                  ? 'bg-green-500/20 text-green-300 border-green-400 shadow-green-400/30 shadow-lg' 
                  : animationStep >= 1
                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400 shadow-yellow-400/30 shadow-lg'
                  : 'bg-red-500/20 text-red-300 border-red-400 shadow-red-400/30 shadow-lg'
              }`}>
                {animationStep >= 2 ? '✓ ACCESS AUTHORIZED' : 
                 animationStep >= 1 ? '◐ SCANNING...' : 
                 '◯ STANDBY MODE'}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          <div className="space-y-3">
            {animationStep >= 0 && (
              <div className="flex items-center justify-center gap-2 text-green-400 text-sm animate-fade-in">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Quantum signature verified</span>
              </div>
            )}
            {animationStep >= 1 && (
              <div className="flex items-center justify-center gap-2 text-blue-400 text-sm animate-fade-in">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Barrier systems activating</span>
              </div>
            )}
            {animationStep >= 2 && (
              <div className="flex items-center justify-center gap-2 text-purple-400 text-sm animate-fade-in">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Portal alignment complete</span>
              </div>
            )}
            {animationStep >= 3 && (
              <div className="flex items-center justify-center gap-2 text-cyan-400 text-sm animate-fade-in">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span>Vehicle transit authorized</span>
              </div>
            )}
            {animationStep >= 4 && (
              <div className="flex items-center justify-center gap-2 text-white text-sm font-semibold animate-fade-in">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Welcome to Smart Parking Complex</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};