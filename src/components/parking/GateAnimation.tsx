import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface GateAnimationProps {
  onComplete: () => void;
}

export const GateAnimation = ({ onComplete }: GateAnimationProps) => {
  const [phase, setPhase] = useState<'approach' | 'scan' | 'verify' | 'unlock' | 'open' | 'proceed'>('approach');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('scan'), 3000);
    const timer2 = setTimeout(() => setPhase('verify'), 6000);
    const timer3 = setTimeout(() => setPhase('unlock'), 9000);
    const timer4 = setTimeout(() => setPhase('open'), 12000);
    const timer5 = setTimeout(() => setPhase('proceed'), 15000);
    const timer6 = setTimeout(() => onComplete(), 18000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <Card className="w-[400px] bg-black/50 backdrop-blur-lg border-blue-500/30 shadow-2xl">
        <CardContent className="p-10 text-center">
          <div className="mb-8">
            {/* Smart Gate Visualization */}
            <div className="relative mb-8">
              <div className="w-40 h-40 mx-auto relative">
                {/* Gate Structure */}
                <div className="absolute inset-0 border-4 border-blue-400/60 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-600/10 backdrop-blur-sm">
                  
                  {/* Car Icon - Always Visible */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl filter drop-shadow-xl" 
                          style={{ 
                            animation: phase === 'approach' ? 'float 3s ease-in-out infinite' :
                                     phase === 'proceed' ? 'drive-through 4s ease-in-out' : 'none'
                          }}>
                      🚗
                    </span>
                  </div>

                  {/* Phase-specific Effects */}
                  {phase === 'approach' && (
                    <div className="absolute inset-0 rounded-xl">
                      <div className="absolute inset-2 border-2 border-blue-300/40 rounded-lg animate-ping" />
                    </div>
                  )}
                  
                  {phase === 'scan' && (
                    <div className="absolute inset-0 overflow-hidden rounded-xl">
                      <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
                           style={{ 
                             top: '20%',
                             animation: 'scan-vertical 3s ease-in-out infinite'
                           }} />
                      <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                           style={{ 
                             top: '50%',
                             animation: 'scan-vertical 3s ease-in-out infinite reverse',
                             animationDelay: '0.5s'
                           }} />
                      <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                           style={{ 
                             top: '80%',
                             animation: 'scan-vertical 3s ease-in-out infinite',
                             animationDelay: '1s'
                           }} />
                    </div>
                  )}
                  
                  {phase === 'verify' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-green-500/30 to-green-400/20 animate-pulse rounded-xl">
                      <div className="absolute inset-4 border-2 border-green-400 rounded-lg animate-pulse" />
                      <div className="absolute top-2 right-2 text-green-400 text-xl animate-bounce">✓</div>
                    </div>
                  )}
                  
                  {phase === 'unlock' && (
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-500/30 to-yellow-400/20 animate-pulse" />
                      <div className="absolute top-4 left-4 text-yellow-400 text-2xl animate-spin">🔓</div>
                    </div>
                  )}
                  
                  {(phase === 'open' || phase === 'proceed') && (
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      {/* Gate Doors Opening */}
                      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-blue-500/40 to-transparent transition-transform duration-[4000ms] ease-out"
                           style={{ transform: 'translateX(-100%)' }} />
                      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-blue-500/40 to-transparent transition-transform duration-[4000ms] ease-out"
                           style={{ transform: 'translateX(100%)' }} />
                      <div className="absolute inset-0 bg-green-400/10 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status Messages */}
            <div className="space-y-4">
              {phase === 'approach' && (
                <div className="text-blue-300">
                  <h3 className="text-2xl font-bold mb-2">🚗 Vehicle Approaching</h3>
                  <p className="text-blue-200">Parking system initializing...</p>
                  <div className="flex justify-center mt-3">
                    <div className="flex space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" 
                             style={{ animationDelay: `${i * 0.4}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {phase === 'scan' && (
                <div className="text-cyan-300">
                  <h3 className="text-2xl font-bold mb-2">🔍 Scanning Vehicle</h3>
                  <p className="text-cyan-200">Reading license plate and verifying booking...</p>
                </div>
              )}

              {phase === 'verify' && (
                <div className="text-green-300">
                  <h3 className="text-2xl font-bold mb-2">✅ Booking Verified</h3>
                  <p className="text-green-200">Reservation confirmed successfully!</p>
                </div>
              )}

              {phase === 'unlock' && (
                <div className="text-yellow-300">
                  <h3 className="text-2xl font-bold mb-2">🔓 Gate Unlocking</h3>
                  <p className="text-yellow-200">Security systems disengaging...</p>
                </div>
              )}

              {phase === 'open' && (
                <div className="text-purple-300">
                  <h3 className="text-2xl font-bold mb-2">🌟 Gate Opening</h3>
                  <p className="text-purple-200">Welcome! Please proceed to your spot</p>
                </div>
              )}

              {phase === 'proceed' && (
                <div className="text-green-300">
                  <h3 className="text-2xl font-bold mb-2">🎉 Access Granted</h3>
                  <p className="text-green-200">Drive safely to your assigned parking!</p>
                </div>
              )}
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden mb-4">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 transition-all duration-[3000ms] ease-out"
              style={{ 
                width: phase === 'approach' ? '15%' : 
                       phase === 'scan' ? '30%' : 
                       phase === 'verify' ? '50%' : 
                       phase === 'unlock' ? '70%' : 
                       phase === 'open' ? '85%' : 
                       '100%' 
              }}
            />
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-12px) scale(1.05); }
        }
        
        @keyframes drive-through {
          0% { transform: translateX(0) scale(1); }
          50% { transform: translateX(25px) scale(1.1); }
          100% { transform: translateX(120px) scale(0.7); opacity: 0.2; }
        }
        
        @keyframes scan-vertical {
          0% { top: 10%; opacity: 1; }
          50% { top: 50%; opacity: 0.7; }
          100% { top: 90%; opacity: 1; }
        }
      `}</style>
    </div>
  );
};