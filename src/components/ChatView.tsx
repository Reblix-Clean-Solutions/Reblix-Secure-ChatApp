import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  Flame,
  Clock,
  Send,
  Smile,
  Mic,
  MoreVertical,
  Check,
  CheckCheck,
  Lock,
  Phone,
  Video,
  Info,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { User, ChatMessage } from '../types';

interface ChatViewProps {
  currentUsername: string;
  partner: User;
  messages: ChatMessage[];
  onSendMessage: (text: string, attachment?: ChatMessage['attachment'], expiresInSec?: number) => void;
  onBack: () => void;
  onClearChat: () => void;
  testMessagesCount: number;
  isLifetimeUnlocked?: boolean;
  onOpenUnlockModal?: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentUsername,
  partner,
  messages,
  onSendMessage,
  onBack,
  onClearChat,
  testMessagesCount,
  isLifetimeUnlocked = false,
  onOpenUnlockModal,
}) => {
  const [inputText, setInputText] = useState('');
  const [selfDestructSec, setSelfDestructSec] = useState<number | undefined>(undefined);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    if (!isLifetimeUnlocked && testMessagesCount <= 0) {
      if (onOpenUnlockModal) {
        onOpenUnlockModal();
      }
      return;
    }

    onSendMessage(inputText.trim(), undefined, selfDestructSec);
    setInputText('');
    setShowEmojiPicker(false);
  };

  const handleSimulateVoice = () => {
    if (!isLifetimeUnlocked && testMessagesCount <= 0) {
      if (onOpenUnlockModal) {
        onOpenUnlockModal();
      }
      return;
    }
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      onSendMessage('🎤 [Verschlüsselte Sprachnachricht (0:08)]', {
        type: 'voice',
        duration: '0:08',
      }, selfDestructSec);
    }, 1500);
  };

  const quickEmojis = ['🔒', '🛡️', '🔑', '🤫', '🔥', '👍', '❤️', '👋', '👀', '💯'];

  return (
    <div className="w-full flex flex-col h-[calc(100vh-65px)] pb-16 bg-[#0c0d11]">
      {/* Top Messenger Bar */}
      <div className="bg-[#12141a] border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <button
            id="btn-chat-back"
            onClick={onBack}
            className="p-2 rounded-xl bg-[#1a1d24] hover:bg-[#232731] border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
            title="Zurück zu Kontakten"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Partner Info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-[#232731] border border-zinc-700/60 text-white font-bold text-base flex items-center justify-center">
                {partner.avatarLetter}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#12141a] ${
                  partner.isOnline ? 'bg-emerald-500' : 'bg-zinc-500'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm tracking-wide">
                  {partner.username}
                </span>
                <span className="bg-[#26131f] border border-[#ff2d78]/40 text-[#ff2d78] text-[9px] font-bold px-1.5 py-0.2 rounded select-none">
                  E2EE 256-BIT
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                {partner.isOnline ? (
                  <span className="text-emerald-400 font-medium">● Online</span>
                ) : (
                  <span>Offline ({partner.lastSeen || 'zuletzt aktiv'})</span>
                )}
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">AES-256 aktiv</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Ephemeral self-destruct selector */}
          <div className="relative hidden sm:block">
            <select
              value={selfDestructSec || ''}
              onChange={(e) =>
                setSelfDestructSec(e.target.value ? Number(e.target.value) : undefined)
              }
              className="bg-[#1a1d24] border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
              title="Selbstzerstörung für Nachrichten"
            >
              <option value="">Timer: Aus</option>
              <option value="10">🔥 10 Sek.</option>
              <option value="30">🔥 30 Sek.</option>
              <option value="60">🔥 1 Min.</option>
              <option value="300">🔥 5 Min.</option>
            </select>
          </div>

          {/* Ephemeral self-destruct notice badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#20141a] border border-[#ff2d78]/40 text-[#ff2d78] text-[11px] font-semibold">
            <Flame className="w-3.5 h-3.5" />
            <span>Löscht beim Verlassen</span>
          </div>

          {/* Security details button */}
          <button
            onClick={() => setShowSecurityInfo(!showSecurityInfo)}
            className="p-2 rounded-xl bg-[#181a20] border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
            title="Sicherheitszertifikat & Status"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Clear chat button */}
          <button
            onClick={onClearChat}
            className="p-2 rounded-xl bg-[#181a20] border border-zinc-800 text-zinc-400 hover:text-red-400 transition cursor-pointer"
            title="Chat-Verlauf sofort manuell leeren"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Security info modal drawer if toggled */}
      {showSecurityInfo && (
        <div className="bg-[#151720] border-b border-zinc-800 p-4 text-xs text-zinc-300 shrink-0">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-white font-bold">
                <Lock className="w-4 h-4 text-[#ff2d78]" />
                <span>Sicherheitsstatus für diesen Chat</span>
              </div>
              <p className="text-zinc-400 text-[11px] mt-1">
                Schlüsselpaar verifiziert. Keine Nachrichten verlassen dein Endgerät unverschlüsselt.
              </p>
              <div className="mt-2 text-[11px] bg-[#0c0d11] p-2 rounded-lg border border-zinc-800 text-emerald-400 flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Sicherheitsverbindung aktiv: AES-256-GCM Ende-zu-Ende verschlüsselt</span>
              </div>
            </div>
            <button
              onClick={() => setShowSecurityInfo(false)}
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg cursor-pointer shrink-0"
            >
              Schließen
            </button>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-4xl w-full mx-auto">
        {/* Top Encryption & Ephemeral Notice */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <div className="bg-[#16181f]/90 border border-zinc-800/90 rounded-2xl p-2.5 max-w-md text-center text-xs text-zinc-400 shadow-sm flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#ff2d78] shrink-0" />
            <span>
              Ende-zu-Ende verschlüsselt: Nur <strong>{currentUsername}</strong> & <strong>{partner.username}</strong>
            </span>
          </div>
          <div className="bg-[#1f131a]/90 border border-[#ff2d78]/30 rounded-2xl p-2.5 text-center text-xs text-zinc-300 shadow-sm flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#ff2d78] shrink-0" />
            <span>
              Vertraulicher Chat: Nachrichten werden gelöscht, sobald du den Chat verlässt.
            </span>
          </div>
        </div>

        {/* Messages List */}
        {messages.map((msg) => {
          const isMe = msg.isSentByMe;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} transition-all`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 shadow-sm text-sm relative ${
                  isMe
                    ? 'bg-gradient-to-br from-[#c91854] to-[#9e1040] text-white rounded-tr-xs shadow-[#c91854]/10'
                    : 'bg-[#181b22] border border-zinc-800/90 text-zinc-100 rounded-tl-xs'
                }`}
              >
                {/* Ephemeral badge if message self-destructs */}
                {msg.expiresInSec && (
                  <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold mb-1 pb-1 border-b border-white/20">
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>Zerstört sich in {msg.expiresInSec}s</span>
                  </div>
                )}

                {/* Attachment if present */}
                {msg.attachment?.type === 'image' && msg.attachment.url && (
                  <div className="mb-2 rounded-xl overflow-hidden border border-black/20">
                    <img
                      src={msg.attachment.url}
                      alt="Encrypted attachment"
                      className="max-h-60 rounded-xl object-cover w-full"
                    />
                  </div>
                )}

                {msg.attachment?.type === 'voice' && (
                  <div className="flex items-center gap-2.5 bg-black/20 p-2.5 rounded-xl mb-1">
                    <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                      <Mic className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="h-1 bg-white/30 rounded-full w-24 sm:w-32" />
                      <span className="text-[10px] text-white/70 mt-1 block">
                        {msg.attachment.duration || '0:08'} • Verschlüsseltes Audio
                      </span>
                    </div>
                  </div>
                )}

                {/* Message text */}
                <p className="break-words leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Timestamp & Status */}
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[10px] select-none ${
                    isMe ? 'text-pink-100/70' : 'text-zinc-500'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isMe && (
                    <span title="Gelesen">
                      <CheckCheck className="w-3.5 h-3.5 text-pink-200" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 italic">
            <span className="w-2 h-2 rounded-full bg-[#ff2d78] animate-ping" />
            <span>{partner.username} tippt eine verschlüsselte Nachricht...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Emoji Bar if toggled */}
      {showEmojiPicker && (
        <div className="max-w-4xl w-full mx-auto px-4 py-2 bg-[#12141a] border-t border-zinc-800/80 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-xs text-zinc-500 font-medium mr-1">Quick-Emoji:</span>
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setInputText((prev) => prev + emoji)}
              className="text-lg hover:scale-125 transition p-1 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Testnachrichten-Status-Banner wenn nicht freigeschaltet */}
      {!isLifetimeUnlocked && (
        <div className={`px-4 py-2 border-t text-xs flex items-center justify-between gap-2 shrink-0 ${
          testMessagesCount > 0
            ? 'bg-[#181119] border-[#ff2d78]/30 text-zinc-300'
            : 'bg-red-950/70 border-red-800 text-red-200'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${testMessagesCount > 0 ? 'bg-[#ff2d78] animate-pulse' : 'bg-red-500'}`} />
            <span>
              {testMessagesCount > 0 ? (
                <>
                  Testmodus: Noch <strong className="text-[#ff2d78] font-bold">{testMessagesCount}</strong> von 5 Testnachrichten übrig (zählt pro Nachricht herunter)
                </>
              ) : (
                <>
                  <strong className="font-bold text-red-300">0 Testnachrichten übrig:</strong> Bitte schalte die Vollversion frei, um weiterzuschreiben.
                </>
              )}
            </span>
          </div>
          {onOpenUnlockModal && (
            <button
              type="button"
              onClick={onOpenUnlockModal}
              className="px-2.5 py-1 rounded-lg bg-[#ff2d78] hover:bg-[#ff4d8d] text-white font-bold text-[11px] transition cursor-pointer shrink-0 shadow-sm"
            >
              Lifetime freischalten (20 €)
            </button>
          )}
        </div>
      )}

      {/* Bottom Message Input Bar */}
      <div className="bg-[#12141a] border-t border-zinc-800/80 px-4 py-3 shrink-0">
        <form
          onSubmit={handleSend}
          className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-3"
        >
          {/* Emoji Toggle */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2.5 rounded-xl border transition cursor-pointer shrink-0 ${
              showEmojiPicker
                ? 'bg-[#251320] border-[#ff2d78]/50 text-[#ff2d78]'
                : 'bg-[#1a1d24] hover:bg-[#232731] border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title="Emojis"
          >
            <Smile className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Verschlüsselte Nachricht an ${partner.username}...`}
              className="w-full bg-[#181b22] border border-zinc-800/90 rounded-2xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#ff2d78]/60 focus:ring-1 focus:ring-[#ff2d78]/30 transition"
            />
            {selfDestructSec && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-amber-400 font-bold bg-amber-950/60 border border-amber-800/50 px-1.5 py-0.5 rounded flex items-center gap-1 select-none">
                <Flame className="w-3 h-3" />
                {selfDestructSec}s
              </span>
            )}
          </div>

          {/* Voice Memo Button */}
          <button
            type="button"
            onClick={handleSimulateVoice}
            disabled={isRecordingVoice}
            className={`p-2.5 rounded-xl border transition cursor-pointer shrink-0 ${
              isRecordingVoice
                ? 'bg-red-950 border-red-600 text-red-400 animate-pulse'
                : 'bg-[#1a1d24] hover:bg-[#232731] border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title="Sprachnachricht aufnehmen"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2.5 sm:px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 ${
              inputText.trim()
                ? 'bg-gradient-to-r from-[#ff0055] to-[#ff0077] hover:from-[#ff1a66] hover:to-[#ff1a88] text-white shadow-lg shadow-[#ff0055]/30 scale-100'
                : 'bg-zinc-800/60 border border-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
            title="Nachricht verschlüsseln & senden"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Senden</span>
          </button>
        </form>
      </div>
    </div>
  );
};
