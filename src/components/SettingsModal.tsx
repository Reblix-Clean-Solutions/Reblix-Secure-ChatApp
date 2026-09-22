import React, { useState } from 'react';
import { X, Settings, Moon, Bell, Shield, Trash2, Key, Check, Share2, Copy } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetAllData: () => void;
  onShareApp?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetAllData,
  onShareApp,
}) => {
  const [notifications, setNotifications] = useState(true);
  const [autoBurn24h, setAutoBurn24h] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = async () => {
    if (onShareApp) {
      onShareApp();
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      return;
    }
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#14161e] border border-zinc-700/80 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#ff2d78]" />
            <h3 className="text-base font-bold text-white">REBLIX Einstellungen</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share App Section */}
        <div className="p-3.5 rounded-xl bg-[#1b1e26] border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#ff2d78]" />
              <span className="text-zinc-200 font-semibold text-xs">App weitergeben / teilen</span>
            </div>
            <span className="text-[10px] text-zinc-400">Link zum Chatten</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Gib den Link an Freunde oder Partner weiter, damit sie REBLIX öffnen und sofort mit dir chatten können.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="bg-[#111318] border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-300 font-mono flex-1 select-all focus:outline-none"
            />
            <button
              id="btn-settings-copy-url"
              onClick={handleCopyLink}
              className="bg-[#24131f] hover:bg-[#34162a] text-[#ff2d78] hover:text-[#ff4d8d] border border-[#ff2d78]/50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Kopiert!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kopieren</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 text-xs">
          {/* Notifications toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#1b1e26] border border-zinc-800">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-zinc-400" />
              <div>
                <span className="text-zinc-200 font-semibold block">Push-Benachrichtigungen</span>
                <span className="text-zinc-500">Mitteilungen bei neuen verschlüsselten Nachrichten</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="accent-[#ff2d78] w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Sound toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#1b1e26] border border-zinc-800">
            <div className="flex items-center gap-3">
              <Moon className="w-4 h-4 text-zinc-400" />
              <div>
                <span className="text-zinc-200 font-semibold block">Diskret-Modus</span>
                <span className="text-zinc-500">Nachrichtenvorschau auf Sperrbildschirm verbergen</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="accent-[#ff2d78] w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Auto Burn 24h */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#1b1e26] border border-zinc-800">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-[#ff2d78]" />
              <div>
                <span className="text-zinc-200 font-semibold block">Auto-Löschen nach 24 Std.</span>
                <span className="text-zinc-500">Alle Nachrichten nach 24 Stunden unwiderruflich verbrennen</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoBurn24h}
              onChange={(e) => setAutoBurn24h(e.target.checked)}
              className="accent-[#ff2d78] w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        {/* Danger zone */}
        <div className="pt-2 border-t border-zinc-800">
          {!showConfirmReset ? (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#201116] border border-[#7e2434] text-[#f87171] hover:bg-[#32171e] text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Lokalen Cache & Schlüssel zurücksetzen</span>
            </button>
          ) : (
            <div className="p-3 bg-[#241217] border border-red-700/60 rounded-xl space-y-2 text-center">
              <p className="text-xs text-red-300 font-medium">
                Wirklich alle lokalen Nachrichten & Schlüssel löschen?
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs rounded-lg hover:bg-zinc-700 cursor-pointer"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => {
                    onResetAllData();
                    setShowConfirmReset(false);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 cursor-pointer"
                >
                  Ja, alles löschen
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Done button */}
        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
};
