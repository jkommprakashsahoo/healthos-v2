import React from 'react';
import { Home, Clock, Sparkles, FileText, User } from 'lucide-react';
import { motion } from 'motion/react';

export type TabType = 'home' | 'timeline' | 'ask_ai' | 'records' | 'profile';

interface BottomNavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  recordsCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
  recordsCount = 8,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'timeline' as TabType, label: 'Timeline', icon: Clock },
    { id: 'ask_ai' as TabType, label: 'Ask AI', icon: Sparkles, isAi: true },
    { id: 'records' as TabType, label: 'Records', icon: FileText, badge: recordsCount },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <nav
      id="bottom-nav-bar"
      aria-label="Bottom Navigation"
      className="absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-2px_12px_rgba(0,0,0,0.04)] pb-safe transition-all duration-200"
    >
      <div className="max-w-[430px] mx-auto px-3 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-2xl transition-all duration-200 ${
                isActive
                  ? tab.isAi
                    ? 'text-[#005FB8] font-semibold'
                    : 'text-slate-900 font-semibold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className={`absolute inset-0 rounded-2xl ${
                    tab.isAi
                      ? 'bg-[#EBF3FC] border border-[#CDE1F8]'
                      : 'bg-slate-100 border border-slate-200/70'
                  }`}
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-0.5">
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'scale-110' : 'scale-100'
                    } ${tab.isAi && isActive ? 'text-[#005FB8]' : ''}`}
                    strokeWidth={isActive ? 2.3 : 1.8}
                  />
                  {tab.isAi && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#005FB8] animate-pulse" />
                  )}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 px-1 py-0.2 bg-[#005FB8] text-[10px] text-white font-bold rounded-full min-w-[15px] h-[15px] flex items-center justify-center shadow-2xs">
                      {tab.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[11px] tracking-tight transition-colors ${
                    isActive ? 'font-semibold' : 'font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
