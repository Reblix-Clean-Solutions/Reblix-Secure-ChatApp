import React from 'react';
import { Shield, Lock, CheckCircle2, EyeOff, FileCheck, KeyRound, ServerOff, Zap } from 'lucide-react';

interface SecurityTabProps {
  currentUsername: string;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ currentUsername }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20 pt-2 px-1">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#ff2d78]" />
            Sicherheit & Verschlüsselung
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            REBLIX nutzt militärtaugliche Ende-zu-Ende Verschlüsselung nach modernsten Standards.
          </p>
        </div>
      </div>

      {/* Main Status Card */}
      <div className="bg-[#16181e] border border-zinc-800/90 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">
                Sicherheitskanal aktiv
              </span>
              <span className="text-xs text-emerald-400">
                AES-256-GCM + X25519 Schlüsselaustausch
              </span>
            </div>
          </div>

          <span className="bg-[#24131c] border border-[#ff2d78]/40 text-[#ff2d78] text-xs font-bold px-3 py-1 rounded-full">
            Zero-Knowledge
          </span>
        </div>

        {/* Security parameters grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="bg-[#1b1e26] p-3.5 rounded-xl border border-zinc-800/80">
            <span className="text-xs text-zinc-500 font-medium block">
              Benutzer-Schlüsselbund
            </span>
            <span className="text-sm font-bold text-zinc-200 mt-1 block">
              Lokal erzeugt für {currentUsername}
            </span>
            <p className="text-[11px] text-zinc-400 mt-1">
              Private kryptografische Schlüssel verbleiben sicher und isoliert auf deinem Gerät.
            </p>
          </div>

          <div className="bg-[#1b1e26] p-3.5 rounded-xl border border-zinc-800/80">
            <span className="text-xs text-zinc-500 font-medium block">
              Metadaten-Schutz
            </span>
            <span className="text-sm font-bold text-zinc-200 mt-1 block">
              Keine Protokollierung (No-Logs)
            </span>
            <p className="text-[11px] text-zinc-400 mt-1">
              Nachrichten werden nach Übertragung oder Ablauf rückstandslos vernichtet.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#12141a] border border-zinc-800 flex items-center gap-3">
          <KeyRound className="w-5 h-5 text-[#ff2d78] shrink-0" />
          <div className="text-xs text-zinc-300">
            <span className="text-white font-bold block">Autonome Sitzungsverschlüsselung</span>
            <span>Jede Nachrichtensitzung wird mit einem rotierenden Einmalschlüssel geschützt.</span>
          </div>
        </div>
      </div>

      {/* Trust guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#16181e] p-4 rounded-2xl border border-zinc-800/80">
          <Lock className="w-5 h-5 text-[#ff2d78] mb-2" />
          <h3 className="text-sm font-bold text-white">Echte E2E-Verschlüsselung</h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Nachrichten werden direkt auf deinem Gerät verschlüsselt und können ausschließlich von deinem gewählten Partner gelesen werden.
          </p>
        </div>

        <div className="bg-[#16181e] p-4 rounded-2xl border border-zinc-800/80">
          <EyeOff className="w-5 h-5 text-emerald-400 mb-2" />
          <h3 className="text-sm font-bold text-white">Selbstzerstörende Chats</h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Stelle individuelle Timer auf 10s, 30s oder 5 Minuten ein. Nachrichten verbrennen nach dem Lesen rückstandslos.
          </p>
        </div>

        <div className="bg-[#16181e] p-4 rounded-2xl border border-zinc-800/80">
          <FileCheck className="w-5 h-5 text-purple-400 mb-2" />
          <h3 className="text-sm font-bold text-white">Sichere Partnersuche</h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Finde deinen Partner anhand seines Benutzernamens. Vollkommen anonym ohne Telefonnummer, Google- oder E-Mail-Konto.
          </p>
        </div>
      </div>
    </div>
  );
};
