import React, { useState } from 'react';
import { Sparkles, CreditCard, Key, CheckCircle2, ShieldCheck } from 'lucide-react';

interface PromoBannerProps {
  freeChatsRemaining: number;
  totalFreeChats: number;
  usedChats: number;
  isUnlocked: boolean;
  isMasterKeyActive: boolean;
  onUnlockLifetime: () => void;
  onUnlockWithMasterKey: (key: string) => boolean;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  freeChatsRemaining,
  totalFreeChats,
  usedChats,
  isUnlocked,
  isMasterKeyActive,
  onUnlockLifetime,
  onUnlockWithMasterKey,
}) => {
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [keyError, setKeyError] = useState(false);
  const [keySuccess, setKeySuccess] = useState(false);

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUnlockWithMasterKey(keyInput)) {
      setKeySuccess(true);
      setKeyError(false);
      setShowKeyInput(false);
      setTimeout(() => setKeySuccess(false), 3000);
    } else {
      setKeyError(true);
    }
  };

  if (isUnlocked || isMasterKeyActive) {
    return (
      <div
        id="card-promo-free-chats-unlocked"
        className="w-full bg-[#101915] border border-emerald-700/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-200"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-950 border border-emerald-700/60 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 tracking-wide uppercase select-none">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {isMasterKeyActive ? '✦ MASTER-KEY AKTIV • VOLLVERSION FREIGESCHALTET' : '✦ LIFETIME UNBEGRENZT AKTIV'}
            </span>
            <span className="bg-[#1b2621] text-emerald-400 text-xs px-2.5 py-1 rounded-md font-medium select-none">
              Alle Chats 100% Kostenlos
            </span>
          </div>
          <p className="text-xs sm:text-[13px] text-zinc-300 mt-2 leading-relaxed">
            Du kannst unbegrenzt viele sichere Chats starten und beliebig viele Partner kontaktieren.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-emerald-900/40 border border-emerald-700/60 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Vollversion freigeschaltet</span>
        </div>
      </div>
    );
  }

  return (
    <div
      id="card-promo-free-chats"
      className="w-full bg-[#150c14] border border-[#a11645]/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex-1 pr-0 md:pr-4">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#381123] border border-[#ff2d78]/40 text-[#ff2d78] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 tracking-wide uppercase select-none">
            <Sparkles className="w-3.5 h-3.5 text-[#ff2d78]" />
            {freeChatsRemaining} VON {totalFreeChats} FREI-CHATS VERFÜGBAR
          </span>

          <span className="bg-[#20222a] border border-zinc-700/60 text-zinc-400 text-xs px-2.5 py-1 rounded-md font-medium select-none">
            Stripe (20,00 €)
          </span>

          {/* Master Key Trigger */}
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="text-[11px] text-[#ff2d78] hover:text-[#ff4d8d] bg-[#22101b] border border-[#ff2d78]/40 hover:border-[#ff2d78] px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <Key className="w-3 h-3" />
            <span>Master-Key einlösen</span>
          </button>
        </div>

        {/* Explanatory text */}
        <p className="text-xs sm:text-[13px] text-zinc-300 mt-2.5 leading-relaxed font-normal">
          Du hast {usedChats} von {totalFreeChats} Frei-Chats genutzt. Nach den {totalFreeChats} Frei-Chats liegt die Bezahlung bei einmalig 20,00 € via Stripe (oder per Master-Key freischaltbar).
        </p>

        {/* Inline Master-Key Input if opened */}
        {showKeyInput && (
          <form onSubmit={handleKeySubmit} className="mt-3 flex items-center gap-2 max-w-sm">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => {
                setKeyInput(e.target.value);
                setKeyError(false);
              }}
              placeholder="Master-Key Code eingeben..."
              className="bg-[#0b0c10] border border-zinc-700 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ff2d78] flex-1 font-mono"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#ff2d78] hover:bg-[#ff4d8d] text-white text-xs font-bold px-3 py-2 rounded-xl cursor-pointer shrink-0"
            >
              Aktivieren
            </button>
          </form>
        )}

        {keyError && (
          <p className="text-[11px] text-red-400 mt-1 font-medium">
            Ungültiger Master-Key Code. Bitte überprüfe deine Eingabe.
          </p>
        )}

        {keySuccess && (
          <p className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Master-Key akzeptiert! App ist jetzt gratis freigeschaltet.
          </p>
        )}
      </div>

      {/* Action Button */}
      <button
        id="btn-unlock-unlimited-chats"
        onClick={onUnlockLifetime}
        className="shrink-0 bg-gradient-to-r from-[#ff0055] to-[#ff0077] hover:from-[#ff1a66] hover:to-[#ff1a88] active:scale-[0.98] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg shadow-[#ff0055]/30 flex items-center justify-center gap-2 transition cursor-pointer"
      >
        <CreditCard className="w-4 h-4" />
        <span>Für 20,00 € unbegrenzt freischalten</span>
      </button>
    </div>
  );
};
