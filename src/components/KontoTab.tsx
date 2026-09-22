import React, { useState } from 'react';
import { User, UserCheck, Copy, Check, UserPlus, ArrowRightLeft, LogOut, CheckCircle2, Key, ShieldCheck } from 'lucide-react';
import { User as UserType } from '../types';

interface KontoTabProps {
  currentUsername: string;
  onChangeUsername: (newName: string) => void;
  registeredUsers: UserType[];
  onSwitchUser: (username: string) => void;
  onAddNewPartner: (username: string) => void;
  onLogout: () => void;
  isMasterKeyActive?: boolean;
  onUnlockWithMasterKey?: (key: string) => boolean;
}

export const KontoTab: React.FC<KontoTabProps> = ({
  currentUsername,
  onChangeUsername,
  registeredUsers,
  onSwitchUser,
  onAddNewPartner,
  onLogout,
  isMasterKeyActive = false,
  onUnlockWithMasterKey,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newUsernameInput, setNewUsernameInput] = useState(currentUsername);
  const [copiedLink, setCopiedLink] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [partnerAddedSuccess, setPartnerAddedSuccess] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [keyError, setKeyError] = useState(false);
  const [keySuccess, setKeySuccess] = useState(false);

  const handleApplyMasterKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUnlockWithMasterKey && onUnlockWithMasterKey(keyInput)) {
      setKeySuccess(true);
      setKeyError(false);
      setKeyInput('');
      setTimeout(() => setKeySuccess(false), 4000);
    } else {
      setKeyError(true);
      setKeySuccess(false);
    }
  };

  const handleSaveUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsernameInput.trim()) {
      onChangeUsername(newUsernameInput.trim());
      setIsEditing(false);
    }
  };

  const handleCopyInvite = () => {
    const inviteLink = `${window.location.origin}/?partner=${encodeURIComponent(currentUsername)}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddPartnerDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName.trim()) return;
    onAddNewPartner(newPartnerName.trim());
    setNewPartnerName('');
    setPartnerAddedSuccess(true);
    setTimeout(() => setPartnerAddedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-20 pt-2 px-1">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
            <User className="w-5 h-5 text-[#ff2d78]" />
            Mein Benutzerkonto
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Verwalte deine REBLIX-Identität, Kontowechsel und Partner-Verbindungen.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="bg-[#211216] border border-[#7e2434] text-[#f87171] hover:bg-[#32171e] text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Konto abmelden</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-[#16181e] border border-zinc-800/90 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#232731] border border-zinc-700/60 text-white font-extrabold text-2xl flex items-center justify-center">
              {currentUsername.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white tracking-wide">
                  {currentUsername}
                </span>
                <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-[10px] px-2 py-0.5 rounded-full font-medium">
                  Aktiv angemeldet
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                REBLIX Anonymous ID • Ende-zu-Ende verschlüsselt
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-[#20232b] hover:bg-[#282d37] text-zinc-300 text-xs font-semibold px-4 py-2 rounded-xl border border-zinc-700/60 transition cursor-pointer self-start sm:self-auto"
          >
            {isEditing ? 'Abbrechen' : 'Benutzername ändern'}
          </button>
        </div>

        {/* Username edit form */}
        {isEditing && (
          <form
            onSubmit={handleSaveUsername}
            className="pt-3 border-t border-zinc-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={newUsernameInput}
              onChange={(e) => setNewUsernameInput(e.target.value)}
              placeholder="Neuer Benutzername..."
              className="bg-[#101217] border border-zinc-700 text-sm text-white px-3.5 py-2 rounded-xl focus:outline-none focus:border-[#ff2d78] w-full max-w-xs"
            />
            <button
              type="submit"
              className="bg-[#ff2d78] hover:bg-[#ff4d8d] text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
            >
              Speichern
            </button>
          </form>
        )}

        {/* Partner Invite Link */}
        <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-zinc-400">
            <span className="text-zinc-200 font-semibold block">Dein Partner-Einladungslink:</span>
            <span>Teile deinen Benutzernamen oder Link mit deinem Partner, um direkt gefunden zu werden.</span>
          </div>
          <button
            onClick={handleCopyInvite}
            className="bg-[#251320] border border-[#ff2d78]/50 text-[#ff2d78] hover:text-[#ff4d8d] text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shrink-0"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Link kopiert!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Einladungslink kopieren</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Master-Key & Status Card */}
      <div className="bg-[#16181e] border border-zinc-800/90 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#ff2d78]" />
            <h3 className="text-sm font-bold text-white">
              Master-Key Status für "{currentUsername}"
            </h3>
          </div>
          {isMasterKeyActive ? (
            <span className="bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Aktiviert</span>
            </span>
          ) : (
            <span className="bg-zinc-800/80 border border-zinc-700 text-zinc-400 text-[11px] font-medium px-3 py-1 rounded-full">
              Nicht aktiv (Standard-Konto)
            </span>
          )}
        </div>

        {isMasterKeyActive ? (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Dieser Account hat den Master-Key freigeschaltet. Du verfügst über unbegrenzte Chats und alle Funktionen.
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-zinc-400 leading-relaxed">
              Der Master-Key ist nicht automatisch für alle aktiv. Wenn du den Code kennst, gib ihn hier ein, um die Vollversion für dieses Konto freizuschalten:
            </p>
            <form onSubmit={handleApplyMasterKey} className="flex gap-2 max-w-md">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => {
                  setKeyInput(e.target.value);
                  setKeyError(false);
                }}
                placeholder="Master-Key eingeben..."
                className="bg-[#0f1116] border border-zinc-700 text-xs text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ff2d78] flex-1 font-mono"
              />
              <button
                type="submit"
                className="bg-[#ff2d78] hover:bg-[#ff4d8d] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0"
              >
                Aktivieren
              </button>
            </form>
            {keyError && (
              <p className="text-xs text-rose-400 font-medium">
                Ungültiger Master-Key. Bitte überprüfe deine Eingabe.
              </p>
            )}
            {keySuccess && (
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Master-Key erfolgreich für "{currentUsername}" aktiviert!</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Account Switcher Card */}
      <div className="bg-[#16181e] border border-zinc-800/90 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-[#ff2d78]" />
            <h3 className="text-sm font-bold text-white">
              Konto wechseln
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400">
            Wähle ein registriertes Profil zum Wechseln
          </span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Klicke auf einen der untenstehenden Benutzer, um sofort zu diesem Account zu wechseln. Der Chat passt sich automatisch an.
        </p>

        {/* Quick User Switcher Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {registeredUsers.map((u) => {
            const isCurrent = u.username.toLowerCase() === currentUsername.toLowerCase();
            return (
              <div
                key={u.id}
                onClick={() => onSwitchUser(u.username)}
                className={`p-3 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                  isCurrent
                    ? 'bg-[#2b1322] border-[#ff2d78] shadow-sm'
                    : 'bg-[#181b22] border-zinc-800 hover:border-zinc-700 hover:bg-[#20242e]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#272b35] text-white font-bold flex items-center justify-center text-xs">
                    {u.avatarLetter || u.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {u.username}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {isCurrent ? 'Aktives Profil' : 'Klicken zum Wechseln'}
                    </span>
                  </div>
                </div>

                {isCurrent ? (
                  <span className="bg-[#ff2d78] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Aktiv</span>
                  </span>
                ) : (
                  <span className="text-xs text-zinc-500 hover:text-white flex items-center gap-1">
                    <span>Wechseln →</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Form to register a new partner / account */}
        <div className="pt-3 border-t border-zinc-800">
          <span className="text-xs font-semibold text-zinc-300 block mb-2">
            Weiteren Benutzer / Partner registrieren:
          </span>
          <form onSubmit={handleAddPartnerDirect} className="flex gap-2">
            <input
              type="text"
              value={newPartnerName}
              onChange={(e) => setNewPartnerName(e.target.value)}
              placeholder="Neuer Benutzername (z.B. alex_secure)..."
              className="bg-[#101217] border border-zinc-700 text-xs text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#ff2d78] flex-1"
            />
            <button
              type="submit"
              className="bg-[#ff2d78] hover:bg-[#ff4d8d] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Registrieren</span>
            </button>
          </form>
          {partnerAddedSuccess && (
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Benutzer erfolgreich registriert! Du kannst jetzt sofort dorthin wechseln oder mit ihm chatten.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
