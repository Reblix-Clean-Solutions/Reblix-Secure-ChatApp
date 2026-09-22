import React, { useState } from 'react';
import { Shield, Settings, LogOut, ArrowRightLeft, CheckCircle2, Share2, Check } from 'lucide-react';

interface HeaderProps {
  currentUsername: string;
  testMessagesCount: number;
  onOpenSecurity: () => void;
  onOpenSettings: () => void;
  onOpenAccountSwitch: () => void;
  onLogout: () => void;
  isMasterKeyActive?: boolean;
  isLifetimeUnlocked?: boolean;
  onShareApp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUsername,
  testMessagesCount,
  onOpenSecurity,
  onOpenSettings,
  onOpenAccountSwitch,
  onLogout,
  isMasterKeyActive = false,
  isLifetimeUnlocked = false,
  onShareApp,
}) => {
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
    if (onShareApp) {
      onShareApp();
    }
  };

  return (
    <header className="w-full bg-[#0c0d11] border-b border-zinc-800/80 px-3 py-2.5 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Logo & Security Button oben links */}
        <div className="flex items-center gap-2.5">
          <div
            id="reblix-logo-badge"
            className="w-10 h-10 rounded-xl bg-[#23121d] border border-[#ff2d78]/40 flex items-center justify-center shadow-sm shrink-0"
          >
            <span className="text-[#ff2d78] font-black text-xl select-none">R</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white font-extrabold text-base sm:text-lg tracking-wider leading-tight">
              REBLIX
            </h1>
            <span className="text-[#ff2d78] text-[9px] sm:text-[10px] font-bold tracking-widest uppercase leading-tight">
              SECURE CHAT
            </span>
          </div>

          {/* Sicherheits-Button oben links */}
          <button
            id="btn-header-security-left"
            onClick={onOpenSecurity}
            title="Sicherheitsstatus & E2E-Verschlüsselung öffnen"
            className="ml-1 sm:ml-2 px-2.5 py-1 rounded-xl bg-[#131b18] hover:bg-[#182622] border border-emerald-800/60 text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm group"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
            <span className="hidden sm:inline">Sicherheit: Aktiv</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block sm:hidden" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Master Key or Lifetime Badge */}
          {isMasterKeyActive ? (
            <div
              id="master-key-header-badge"
              className="bg-[#24131c] border border-[#ff2d78]/60 text-[#ff2d78] text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 select-none"
            >
              <span className="w-2 h-2 rounded-full bg-[#ff2d78] animate-pulse" />
              <span>MASTER-KEY AKTIV</span>
            </div>
          ) : isLifetimeUnlocked ? (
            <div
              id="lifetime-header-badge"
              className="bg-[#12231b] border border-emerald-500/50 text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 select-none"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>LIFETIME AKTIV</span>
            </div>
          ) : (
            <div
              id="test-messages-badge"
              className="bg-[#24131c] border border-[#ff2d78]/50 text-[#ff2d78] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 select-none"
            >
              <span className="w-2 h-2 rounded-full bg-[#ff2d78] animate-pulse inline-block" />
              <span className="tracking-wide text-[11px] sm:text-xs">TESTNACHRICHTEN: {testMessagesCount}</span>
            </div>
          )}

          {/* Share App URL button */}
          {onShareApp && (
            <button
              id="btn-header-share-app"
              onClick={handleShare}
              title="App-Link kopieren & weitergeben"
              className="px-2.5 py-1.5 rounded-xl bg-[#22131e] border border-[#ff2d78]/40 hover:border-[#ff2d78] text-[#ff2d78] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline text-emerald-400">Kopiert!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">App teilen</span>
                </>
              )}
            </button>
          )}

          {/* Shield Button (rechts) */}
          <button
            id="btn-header-security"
            onClick={onOpenSecurity}
            title="Sicherheitsstatus öffnen"
            className="p-2 rounded-xl bg-[#181a20] border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition cursor-pointer"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            id="btn-header-settings"
            onClick={onOpenSettings}
            title="Einstellungen"
            className="p-2 rounded-xl bg-[#181a20] border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Konto wechseln Button */}
          <button
            id="btn-header-switch-account"
            onClick={onOpenAccountSwitch}
            title={`Aktuell: ${currentUsername} • Konto wechseln`}
            className="px-2.5 py-1.5 rounded-xl bg-[#191c24] border border-zinc-700/80 text-zinc-300 hover:text-white hover:border-[#ff2d78]/50 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#ff2d78]" />
            <span className="max-w-[70px] sm:max-w-[100px] truncate">{currentUsername}</span>
          </button>

          {/* Abmelden Button */}
          <button
            id="btn-header-logout"
            onClick={onLogout}
            title="Abmelden"
            className="bg-[#211216] border border-[#7e2434] text-[#f87171] hover:bg-[#32171e] hover:border-[#a83247] px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Abmelden</span>
          </button>
        </div>
      </div>
    </header>
  );
};
