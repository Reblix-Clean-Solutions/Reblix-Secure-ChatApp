import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

interface MyNameCardProps {
  username: string;
  onEditUsername?: () => void;
  onShareApp?: () => void;
}

export const MyNameCard: React.FC<MyNameCardProps> = ({ username, onShareApp }) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(username);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareClick = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
    if (onShareApp) {
      onShareApp();
    }
  };

  const initial = username.charAt(0).toUpperCase() || 'D';

  return (
    <div
      id="card-my-partner-name"
      className="w-full bg-[#16181e] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
    >
      <div className="flex items-center gap-4">
        {/* User avatar box */}
        <div className="w-12 h-12 rounded-xl bg-[#232731] border border-zinc-700/50 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-xl">{initial}</span>
        </div>

        {/* User identification info */}
        <div>
          <span className="text-xs text-zinc-400 block font-normal">
            Dein Name für deinen Partner:
          </span>
          <span className="text-xl font-bold text-white tracking-wide block">
            {username}
          </span>
        </div>
      </div>

      {/* Action Buttons: Namen kopieren & App-Link weitergeben */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          id="btn-copy-partner-name"
          onClick={handleCopy}
          className="bg-[#20232b] hover:bg-[#2a2e38] active:bg-[#1a1d24] text-zinc-200 hover:text-white text-xs sm:text-sm font-medium px-3.5 py-2.5 rounded-xl border border-zinc-700/60 flex items-center gap-2 transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Kopiert!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-zinc-400" />
              <span>Namen kopieren</span>
            </>
          )}
        </button>

        {onShareApp && (
          <button
            id="btn-share-app-link"
            onClick={handleShareClick}
            className="bg-[#261320] hover:bg-[#32172a] text-[#ff2d78] hover:text-[#ff4d8d] text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-xl border border-[#ff2d78]/40 flex items-center gap-2 transition cursor-pointer shadow-sm"
            title="App-Link kopieren und an Partner weitergeben"
          >
            {shared ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Link kopiert!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#ff2d78]" />
                <span>App-Link teilen</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
