import React, { useState } from 'react';
import { Shield, UserPlus, LogIn, Key, CheckCircle2, User, Sparkles, ArrowRight, Trash2 } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthScreenProps {
  registeredUsers: UserType[];
  onLogin: (username: string) => void;
  onRegister: (newUser: UserType) => void;
  onUnlockWithMasterKey: (key: string) => boolean;
  isMasterKeyActive: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  registeredUsers,
  onLogin,
  onRegister,
  onUnlockWithMasterKey,
  isMasterKeyActive,
}) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ff2d78');
  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [masterKeySuccess, setMasterKeySuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Strictly only this device's own saved profile - NEVER other users!
  const [savedOwnProfile, setSavedOwnProfile] = useState<string | null>(() => {
    return localStorage.getItem('reblix_saved_own_username');
  });

  const colors = ['#ff2d78', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanName = username.trim().toLowerCase();
    if (!cleanName) {
      setErrorMsg('Bitte gib einen gültigen Benutzernamen ein.');
      return;
    }
    if (cleanName.length < 3) {
      setErrorMsg('Der Benutzername muss mindestens 3 Zeichen lang sein.');
      return;
    }

    const exists = registeredUsers.some((u) => u.username.toLowerCase() === cleanName);
    if (exists) {
      setErrorMsg(`Der Benutzername "${cleanName}" existiert bereits. Bitte melde dich an oder wähle einen anderen Namen.`);
      return;
    }

    // Save as this device's own profile
    localStorage.setItem('reblix_saved_own_username', cleanName);
    setSavedOwnProfile(cleanName);

    const newUser: UserType = {
      id: `user_${cleanName}_${Date.now()}`,
      username: cleanName,
      displayName: cleanName,
      isOnline: true,
      lastSeen: 'Gerade registriert',
      avatarLetter: cleanName.charAt(0).toUpperCase(),
      description: 'Verifizierter Benutzer • Bereit für sicheren Chat',
      isMainAccount: true,
    };

    onRegister(newUser);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanName = username.trim().toLowerCase();
    if (!cleanName) {
      setErrorMsg('Bitte gib deinen Benutzernamen ein.');
      return;
    }

    const user = registeredUsers.find((u) => u.username.toLowerCase() === cleanName);
    if (!user) {
      // Allow instant creation or prompt
      setErrorMsg(`Benutzername "${cleanName}" nicht gefunden. Du kannst dich direkt im Reiter "Registrieren" anmelden.`);
      return;
    }

    // Save as this device's own profile
    localStorage.setItem('reblix_saved_own_username', user.username);
    setSavedOwnProfile(user.username);

    onLogin(user.username);
  };

  const handleApplyMasterKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUnlockWithMasterKey(masterKeyInput)) {
      setMasterKeySuccess(true);
      setMasterKeyInput('');
      setTimeout(() => setMasterKeySuccess(false), 4000);
    } else {
      setErrorMsg('Ungültiger Master-Key. Bitte überprüfe deine Eingabe.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d11] text-zinc-200 flex flex-col justify-center items-center px-4 py-8 selection:bg-[#ff2d78] selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#23121d] border border-[#ff2d78]/50 shadow-lg shadow-[#ff2d78]/10 mb-1">
            <span className="text-[#ff2d78] font-black text-2xl">R</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-wider">
            REBLIX <span className="text-[#ff2d78] text-base uppercase font-bold tracking-widest block sm:inline">SECURE CHAT</span>
          </h1>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Anonyme, Ende-zu-Ende verschlüsselte Kommunikation ohne Handynummer oder E-Mail.
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="bg-[#14161e] p-1 rounded-2xl border border-zinc-800 flex gap-1">
          <button
            id="tab-auth-register"
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'register'
                ? 'bg-[#251320] text-[#ff2d78] border border-[#ff2d78]/50 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Selbst registrieren</span>
          </button>
          <button
            id="tab-auth-login"
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login'
                ? 'bg-[#251320] text-[#ff2d78] border border-[#ff2d78]/50 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Anmelden</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-[#14161e] border border-zinc-800/90 rounded-2xl p-6 shadow-xl space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800/60 text-red-300 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          {mode === 'register' ? (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Wunsch-Benutzername:
                </label>
                <input
                  id="input-register-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="z.B. dominik112 oder dein Alias..."
                  className="w-full bg-[#0d0e13] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d78] transition"
                  autoFocus
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  Dieser Name wird deinem Partner für die Suche angezeigt.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Sicherheits-PIN (optional):
                </label>
                <input
                  id="input-register-pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="4-stellige PIN für schnellen Login"
                  maxLength={8}
                  className="w-full bg-[#0d0e13] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d78] transition"
                />
              </div>

              {/* Avatar Color Picker */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Profilfarbe:
                </label>
                <div className="flex gap-2.5">
                  {colors.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-xl border-2 transition cursor-pointer ${
                        selectedColor === c ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <button
                id="btn-submit-register"
                type="submit"
                className="w-full bg-gradient-to-r from-[#ff0055] to-[#ff0077] hover:from-[#ff1a66] hover:to-[#ff1a88] text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-[#ff0055]/30 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Konto erstellen & sofort chatten</span>
              </button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Benutzername eingeben:
                </label>
                <input
                  id="input-login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Dein registrierter Benutzername..."
                  className="w-full bg-[#0d0e13] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d78] transition"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Sicherheits-PIN (falls vergeben):
                </label>
                <input
                  id="input-login-pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="PIN eingeben"
                  className="w-full bg-[#0d0e13] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2d78] transition"
                />
              </div>

              <button
                id="btn-submit-login"
                type="submit"
                className="w-full bg-gradient-to-r from-[#ff0055] to-[#ff0077] hover:from-[#ff1a66] hover:to-[#ff1a88] text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-[#ff0055]/30 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Jetzt anmelden</span>
              </button>
            </form>
          )}

          {/* Schnell-Login als gespeichertes Profil: NUR das eigene Profil auf diesem Gerät! */}
          {savedOwnProfile && (
            <div className="pt-4 border-t border-zinc-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 block">
                  Schnell-Login (dein gespeichertes Profil):
                </span>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('reblix_saved_own_username');
                    setSavedOwnProfile(null);
                  }}
                  title="Profil von diesem Gerät entfernen"
                  className="text-[11px] text-zinc-500 hover:text-red-400 transition cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Entfernen</span>
                </button>
              </div>

              <div className="flex items-center justify-between bg-[#191c24] border border-zinc-700/80 rounded-xl p-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#23121d] border border-[#ff2d78]/50 flex items-center justify-center text-white font-bold text-xs">
                    {savedOwnProfile.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{savedOwnProfile}</span>
                    <span className="text-[10px] text-zinc-500">Dein eigenes Profil auf diesem Gerät</span>
                  </div>
                </div>
                <button
                  id="btn-quick-login-own"
                  type="button"
                  onClick={() => onLogin(savedOwnProfile)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#ff2d78] hover:bg-[#ff4d8d] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Direkt anmelden</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Master Key Free Unlock Section */}
        <div className="bg-[#171018] border border-[#a11645]/70 rounded-2xl p-4 shadow-md space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-[#ff2d78]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Master-Key Freischaltung
              </span>
            </div>
            {isMasterKeyActive ? (
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Aktiv
              </span>
            ) : (
              <span className="text-[11px] text-zinc-400 font-medium">Autorisierter Zugang</span>
            )}
          </div>

          <p className="text-xs text-zinc-400">
            Besitzt du einen Master-Key? Gib deinen geheimen Code ein, um die Vollversion freizuschalten.
          </p>

          <form onSubmit={handleApplyMasterKey} className="flex gap-2 pt-1">
            <input
              type="password"
              value={masterKeyInput}
              onChange={(e) => setMasterKeyInput(e.target.value)}
              placeholder="Master-Key Code eingeben..."
              className="bg-[#0c0d12] border border-zinc-700 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-[#ff2d78] flex-1 font-mono"
            />
            <button
              type="submit"
              className="bg-[#ff2d78] hover:bg-[#ff4d8d] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0"
            >
              Aktivieren
            </button>
          </form>

          {masterKeySuccess && (
            <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Master-Key aktiviert! App erfolgreich freigeschaltet.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
