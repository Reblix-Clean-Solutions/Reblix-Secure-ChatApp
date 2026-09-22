import React from 'react';
import { MessageSquare, Shield, Sparkles, User as UserIcon } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  unreadChatsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  unreadChatsCount = 0,
}) => {
  const navItems = [
    {
      id: 'chats' as ActiveTab,
      label: 'Chats',
      icon: MessageSquare,
      badge: unreadChatsCount > 0 ? unreadChatsCount : null,
    },
    {
      id: 'security' as ActiveTab,
      label: 'Sicherheit',
      icon: Shield,
    },
    {
      id: 'lifetime' as ActiveTab,
      label: 'Lifetime',
      icon: Sparkles,
    },
    {
      id: 'account' as ActiveTab,
      label: 'Konto',
      icon: UserIcon,
    },
  ];

  return (
    <nav
      id="bottom-nav-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#101216]/95 backdrop-blur-md border-t border-zinc-800/80 px-4 py-2"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition cursor-pointer relative ${
                isActive
                  ? 'text-[#ff2d78]'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className="relative">
                <IconComponent
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#ff2d78] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-1 font-medium select-none ${
                  isActive ? 'font-semibold text-[#ff2d78]' : 'text-zinc-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
