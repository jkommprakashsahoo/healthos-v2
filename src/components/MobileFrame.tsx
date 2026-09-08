import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Smartphone, Maximize2, Sparkles, CheckCircle2 } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('9:41');
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start sm:py-6 p-0 sm:px-4 font-sans text-slate-900 antialiased selection:bg-[#EBF3FC] selection:text-[#005FB8]">
      {/* Desktop Top Helper Bar */}
      <header className="hidden sm:flex items-center justify-between w-full max-w-[430px] mb-3 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <span className="w-2 h-2 rounded-full bg-[#005FB8] animate-pulse" />
          <span>Health Memory · Mobile Prototype</span>
        </div>

        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 active:scale-95 text-[11px] font-medium"
        >
          {isPhoneFrame ? (
            <>
              <Maximize2 className="w-3 h-3" />
              <span>Fluid Width</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3 h-3" />
              <span>iPhone 15 Frame</span>
            </>
          )}
        </button>
      </header>

      {/* Device Outer Frame */}
      <main
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[412px] sm:h-[870px] sm:max-h-[92vh] sm:rounded-[48px] sm:border-[9px] sm:border-slate-800/90 sm:shadow-[0_25px_70px_rgba(0,0,0,0.65)] relative overflow-hidden bg-[#F7F8FA] flex flex-col'
            : 'max-w-2xl min-h-screen bg-[#F7F8FA] sm:rounded-2xl flex flex-col shadow-xl'
        }`}
      >
        {/* iOS Dynamic Island & Status Bar */}
        <div className="sticky top-0 z-30 bg-[#F7F8FA]/90 backdrop-blur-md pt-3 px-6 pb-2 flex items-center justify-between select-none border-b border-slate-200/50">
          {/* Time */}
          <span className="text-xs font-bold text-slate-800 tracking-tight">
            {currentTime}
          </span>

          {/* Dynamic Island Pill */}
          <div className="w-24 h-4.5 bg-slate-900 rounded-full flex items-center justify-center gap-2 px-2 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#005FB8] animate-ping" />
            <span className="text-[9px] font-bold text-blue-200 tracking-wider">
              MEMORY
            </span>
          </div>

          {/* Signal / Wifi / Battery */}
          <div className="flex items-center gap-1.5 text-slate-800">
            <Signal className="w-3 h-3" strokeWidth={2.5} />
            <Wifi className="w-3 h-3" strokeWidth={2.5} />
            <Battery className="w-4 h-4" strokeWidth={2.5} />
          </div>
        </div>

        {/* Inner Scrollable Mobile Screen Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain relative scroll-smooth no-scrollbar">
          {children}
        </div>

        {/* iOS Home Indicator Bar */}
        <div className="sticky bottom-0 left-0 right-0 h-4 bg-transparent pointer-events-none flex items-center justify-center z-50">
          <div className="w-32 h-1 bg-slate-400/60 rounded-full" />
        </div>
      </main>
    </div>
  );
};
