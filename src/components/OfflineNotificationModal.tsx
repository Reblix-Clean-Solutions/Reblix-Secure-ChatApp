import React from 'react';
import { Mail, MessageSquare, ArrowRight, X, ShieldAlert } from 'lucide-react';
import { User, ChatMessage } from '../types';

interface OfflineNotificationModalProps {
  isOpen: boolean;
  currentUsername: string;
  offlineSenders: {
    user: User;
    messages: ChatMessage[];
  }[];
  onOpenChat: (user: User) => void;
  onDismiss: () => void;
}

export const OfflineNotificationModal: React.FC<OfflineNotificationModalProps> = ({
  isOpen,
  currentUsername,
  offlineSenders,
  onOpenChat,
  onDismiss,
}) => {
  if (!isOpen || offlineSenders.length === 0) return null;

  const totalCount = offlineSenders.reduce((acc, curr) => acc + curr.messages.length, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#13151d] border border-[#ff2d78]/60 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 relative">
        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#27131e] border border-[#ff2d78]/50 flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6 text-[#ff2d78] animate-pulse" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base sm:text-lg flex items-center gap-1.5">
              <span>Neue Offline-Nachrichten</span>
              <span className="text-xs bg-[#ff2d78] text-white font-bold px-2 py-0.5 rounded-full">
                {totalCount}
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Während du abwesend warst, sind verschlüsselte Nachrichten eingetroffen für{' '}
              <span className="text-[#ff2d78] font-semibold">{currentUsername}</span>:
            </p>
          </div>
        </div>

        {/* Senders List */}
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {offlineSenders.map(({ user, messages }) => {
            const latestMsg = messages[messages.length - 1];

            return (
              <div
                key={user.id}
                onClick={() => onOpenChat(user)}
                className="bg-[#191c24] hover:bg-[#202430] border border-zinc-800 hover:border-[#ff2d78]/60 rounded-xl p-3.5 flex items-center justify-between gap-3 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#232733] border border-zinc-700/60 text-white font-bold flex items-center justify-center shrink-0">
                    {user.avatarLetter}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm truncate group-hover:text-[#ff2d78] transition">
                        {user.username}
                      </span>
                      <span className="text-[10px] bg-red-950/80 text-red-400 border border-red-800/40 px-1.5 py-0.2 rounded font-medium">
                        {messages.length} {messages.length === 1 ? 'Nachricht' : 'Nachrichten'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      "{latestMsg?.text || 'Verschlüsselte Nachricht'}"
                    </p>
                    <span className="text-[10px] text-zinc-500">
                      Um {latestMsg?.timestamp || 'kürzlich'} gesendet
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1 text-[#ff2d78] group-hover:translate-x-1 transition text-xs font-semibold">
                  <span className="hidden sm:inline">Jetzt lesen</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Auto-destroy notice reminder */}
        <div className="bg-[#1f131a] border border-[#ff2d78]/30 rounded-xl p-2.5 text-xs text-zinc-300 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-[#ff2d78] shrink-0 mt-0.5" />
          <span>
            <strong>Sicherheitshinweis:</strong> Sobald du den Chat nach dem Lesen verlässt, wird der Chatverlauf zum Schutz deiner Privatsphäre rückstandslos gelöscht.
          </span>
        </div>

        {/* Footer actions */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={onDismiss}
            className="text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-xl transition cursor-pointer"
          >
            Später ansehen
          </button>
          {offlineSenders.length === 1 && (
            <button
              onClick={() => onOpenChat(offlineSenders[0].user)}
              className="bg-[#ff2d78] hover:bg-[#ff1a6d] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-[#ff2d78]/25 flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Chat mit {offlineSenders[0].user.username} öffnen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
