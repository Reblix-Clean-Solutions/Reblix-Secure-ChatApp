import React, { useState } from 'react';
import { Sparkles, Check, CreditCard, ShieldCheck, Key, CheckCircle2 } from 'lucide-react';

interface LifetimeTabProps {
  freeChatsRemaining: number;
  totalFreeChats: number;
  isUnlocked: boolean;
  isMasterKeyActive: boolean;
  onOpenCheckout: () => void;
  onUnlockWithMasterKey: (key: string) => boolean;
}

export const LifetimeTab: React.FC<LifetimeTabProps> = ({
  freeChatsRemaining,
  totalFreeChats,
  isUnlocked,
  isMasterKeyActive,
  onOpenCheckout,
  onUnlockWithMasterKey,
}) => {
  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [keyError, setKeyError] = useState(false);
  const [keySuccess, setKeySuccess] = useState(false);

  const handleApplyKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUnlockWithMasterKey(masterKeyInput)) {
      setKeySuccess(true);
      setKeyError(false);
      setMasterKeyInput('');
    } else {
      setKeyError(true);
      setKeySuccess(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20 pt-2 px-1">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#ff2d78]" />
          Lifetime Unbegrenzt
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Einmalige Zahlung via Stripe oder autorisierte Freischaltung per Master-Key.
        </p>
      </div>

      {/* Pricing Card */}
      <div className="bg-[#16181e] border border-[#a11645]/80 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#381123] border border-[#ff2d78]/40 text-[#ff2d78] text-xs font-bold px-3 py-1 rounded-full uppercase">
                {isUnlocked || isMasterKeyActive ? 'AKTIVIERT • LIFETIME' : 'EINMALIG'}
              </span>
              <span className="text-xs text-zinc-400">Kein Abonnement</span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {isMasterKeyActive ? '0,00 €' : '20,00 €'}
              </span>
              <span className="text-sm text-zinc-400">
                {isMasterKeyActive ? 'freigeschaltet via Master-Key' : 'einmalig'}
              </span>
            </div>

            <p className="text-xs text-zinc-300 mt-2 max-w-lg leading-relaxed">
              {isUnlocked || isMasterKeyActive
                ? 'Du genießt bereits den unbegrenzten REBLIX Lifetime-Zugang. Keine Limits auf Chats, Partner oder Medien.'
                : `Du hast aktuell noch ${freeChatsRemaining} von ${totalFreeChats} Frei-Chats verfügbar. Sichere dir jetzt die unbegrenzte Flatrate für dich und deine Partner.`}
            </p>
          </div>

          <button
            onClick={onOpenCheckout}
            disabled={isUnlocked || isMasterKeyActive}
            className={`px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg transition cursor-pointer shrink-0 ${
              isUnlocked || isMasterKeyActive
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 cursor-default'
                : 'bg-gradient-to-r from-[#ff0055] to-[#ff0077] hover:from-[#ff1a66] hover:to-[#ff1a88] text-white shadow-[#ff0055]/30'
            }`}
          >
            {isUnlocked || isMasterKeyActive ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Lifetime aktiv (Vollversion)</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Via Stripe freischalten (20,00 €)</span>
              </>
            )}
          </button>
        </div>

        {/* Feature List */}
        <div className="mt-6 pt-6 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Unbegrenzt viele Partner & Kontakte suchen und finden',
            'Unbegrenzte verschlüsselte Text- & Sprachnachrichten',
            'Höchste Priorität für Echtzeit-Verbindungen',
            'Selbstzerstörende Nachrichten ohne Zeitbegrenzung',
            'Keine Werbung, kein Tracking, kein Abo-Zwang',
            'Autorisierte Freischaltung per Master-Key möglich',
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-300">
              <div className="w-4 h-4 rounded-full bg-[#2a1320] text-[#ff2d78] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Master Key Card */}
      <div className="bg-[#141219] border border-[#a11645]/60 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#ff2d78]" />
            <h3 className="text-sm font-bold text-white">
              Master-Key Freischaltung
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400 font-medium">Autorisierter Zugang</span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Besitzt du einen autorisierten Master-Key? Gib deinen geheimen Schlüssel ein, um die Vollversion freizuschalten.
        </p>

        {!isMasterKeyActive ? (
          <form onSubmit={handleApplyKey} className="flex flex-col sm:flex-row gap-2 pt-1 max-w-md">
            <input
              type="password"
              value={masterKeyInput}
              onChange={(e) => {
                setMasterKeyInput(e.target.value);
                setKeyError(false);
              }}
              placeholder="Master-Key eingeben..."
              className="bg-[#0b0c10] border border-zinc-700 text-xs text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ff2d78] flex-1 font-mono"
            />
            <button
              type="submit"
              className="bg-[#ff2d78] hover:bg-[#ff4d8d] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer shrink-0"
            >
              Freischalten
            </button>
          </form>
        ) : (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Master-Key ist aktiv. Die App ist dauerhaft freigeschaltet!</span>
          </div>
        )}

        {keyError && (
          <p className="text-xs text-red-400 font-semibold">
            Ungültiger Master-Key. Bitte überprüfe deine Eingabe.
          </p>
        )}
        {keySuccess && (
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Master-Key erfolgreich aktiviert!
          </p>
        )}
      </div>
    </div>
  );
};
