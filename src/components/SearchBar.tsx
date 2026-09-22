import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MessageSquare, UserCheck, UserPlus, CheckCircle2, Circle } from 'lucide-react';
import { User } from '../types';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  registeredUsers: User[];
  onSelectUserToChat: (user: User) => void;
  onAddNewPartner: (username: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  registeredUsers,
  onSelectUserToChat,
  onAddNewPartner,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter existing registered users matching the query
  const queryTrimmed = searchQuery.trim().toLowerCase();
  const matchedUsers = queryTrimmed
    ? registeredUsers.filter((u) =>
        u.username.toLowerCase().includes(queryTrimmed) ||
        (u.displayName && u.displayName.toLowerCase().includes(queryTrimmed))
      )
    : [];

  const exactMatchExists = registeredUsers.some(
    (u) => u.username.toLowerCase() === queryTrimmed
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Search Input Box */}
      <div
        id="search-input-container"
        className={`w-full bg-[#16181e] border ${
          isFocused ? 'border-[#ff2d78]/60 ring-1 ring-[#ff2d78]/30' : 'border-zinc-800/80'
        } rounded-2xl px-4 py-3.5 flex items-center gap-3 transition shadow-sm`}
      >
        <Search className="w-5 h-5 text-zinc-500 shrink-0" />
        <input
          id="partner-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Partner nach Benutzernamen suchen..."
          className="w-full bg-transparent text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
            title="Suche zurücksetzen"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Real-time search dropdown results when typing */}
      {isFocused && searchQuery.trim().length > 0 && (
        <div
          id="partner-search-results-dropdown"
          className="absolute left-0 right-0 top-full mt-2 bg-[#14161d] border border-zinc-700/80 rounded-2xl shadow-2xl p-3 z-50 backdrop-blur-md max-h-96 overflow-y-auto"
        >
          <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-zinc-800/80 text-xs text-zinc-400">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#ff2d78]" />
              Gefundene angemeldete Partner ({matchedUsers.length})
            </span>
            <span className="text-[11px] text-zinc-500">Live-Suche im Netzwerk</span>
          </div>

          {matchedUsers.length > 0 ? (
            <div className="space-y-1.5">
              {matchedUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    onSelectUserToChat(user);
                    setIsFocused(false);
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#1a1d24] hover:bg-[#222631] border border-zinc-800/80 hover:border-[#ff2d78]/40 flex items-center justify-between transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-[#272b35] text-white font-bold flex items-center justify-center text-sm border border-zinc-700/50">
                        {user.avatarLetter}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1a1d24] ${
                          user.isOnline ? 'bg-emerald-500' : 'bg-zinc-500'
                        }`}
                        title={user.isOnline ? 'Angemeldet & Online' : 'Offline'}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm group-hover:text-[#ff2d78] transition">
                          {user.username}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            user.isOnline
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
                          }`}
                        >
                          {user.isOnline ? 'Angemeldet' : 'Offline'}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate max-w-[200px] sm:max-w-xs mt-0.5">
                        {user.description || 'Bereit für sicheren Chat'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectUserToChat(user);
                      setIsFocused(false);
                    }}
                    className="shrink-0 bg-[#25131d] hover:bg-[#381628] border border-[#ff2d78]/50 text-[#ff2d78] hover:text-[#ff4d8d] text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat öffnen →</span>
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {/* If user is not yet in contacts, allow finding & registering immediately! */}
          {!exactMatchExists && queryTrimmed.length >= 2 && (
            <div className="mt-2 pt-2 border-t border-zinc-800">
              <div className="p-3 rounded-xl bg-[#1d1520] border border-[#ff2d78]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#2f1325] text-[#ff2d78] flex items-center justify-center font-bold">
                    {queryTrimmed.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs text-white font-semibold flex items-center gap-1.5">
                      <span>Partner &ldquo;{queryTrimmed}&rdquo; suchen & anchatten</span>
                      <span className="bg-[#ff2d78]/20 text-[#ff2d78] text-[9px] px-1.5 py-0.5 rounded font-bold">
                        NEU
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400 block">
                      Angemeldeten Partner im Netzwerk finden und sichere Verbindung aufbauen.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onAddNewPartner(queryTrimmed);
                    setIsFocused(false);
                  }}
                  className="bg-gradient-to-r from-[#ff0055] to-[#ff0077] hover:from-[#ff1a66] hover:to-[#ff1a88] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow transition cursor-pointer shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Jetzt verbinden & chatten</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
