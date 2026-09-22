import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Trash2, MoreVertical, ArrowRight, Radio, Mail, MessageSquare } from 'lucide-react';
import { User } from '../types';

interface ContactListProps {
  contacts: User[];
  onOpenChat: (user: User) => void;
  onDeleteContact: (userId: string) => void;
  onRefreshContacts: () => void;
  unreadCounts?: Record<string, number>;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onOpenChat,
  onDeleteContact,
  onRefreshContacts,
  unreadCounts = {},
}) => {
  const [openMenuContactId, setOpenMenuContactId] = useState<string | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setOpenMenuContactId(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div ref={menuContainerRef} className="w-full space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {/* Signal Indicator ((•)) */}
          <span className="text-emerald-400 font-extrabold text-sm tracking-wider select-none">
            ((•))
          </span>
          <h2 className="text-white font-bold text-sm sm:text-base tracking-wide uppercase">
            VERFÜGBARE KONTAKTE ({contacts.length})
          </h2>
          <button
            id="btn-refresh-contacts"
            onClick={onRefreshContacts}
            title="Kontakte aktualisieren"
            className="p-1.5 rounded-lg bg-[#1a1d24] border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition cursor-pointer ml-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="text-xs text-zinc-500 font-normal hidden sm:inline">
          Wähle einen Benutzer zum Chatten
        </span>
      </div>

      {/* Contact Cards List */}
      <div className="space-y-3">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            id={`contact-card-${contact.id}`}
            onClick={() => onOpenChat(contact)}
            className="w-full bg-[#16181e] hover:bg-[#1a1d25] border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl p-4 flex items-center justify-between gap-3 transition shadow-sm cursor-pointer group"
          >
            {/* Left side: Avatar & info */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-xl bg-[#232731] border border-zinc-700/50 text-white font-bold text-lg flex items-center justify-center">
                  {contact.avatarLetter}
                </div>
                {/* Status Dot */}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#16181e] ${
                    contact.isOnline ? 'bg-emerald-500' : 'bg-zinc-500'
                  }`}
                  title={contact.isOnline ? 'Online' : 'Offline'}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-base truncate group-hover:text-[#ff2d78] transition">
                    {contact.username}
                  </span>
                  {unreadCounts[contact.id] > 0 && (
                    <span className="bg-[#ff2d78] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm animate-pulse">
                      <Mail className="w-2.5 h-2.5" />
                      <span>{unreadCounts[contact.id]} neu</span>
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      contact.isOnline
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {contact.isOnline ? 'online' : 'offline'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate mt-0.5">
                  {contact.description}
                </p>
              </div>
            </div>

            {/* Right side: Delete, Chat öffnen, Menu */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Trash icon */}
              <button
                id={`btn-delete-contact-${contact.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteContact(contact.id);
                }}
                title="Kontakt entfernen"
                className="text-zinc-600 hover:text-red-400 p-2 rounded-lg hover:bg-zinc-800/60 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Chat öffnen button / link */}
              <button
                id={`btn-open-chat-${contact.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenChat(contact);
                }}
                className="text-[#ff2d78] hover:text-[#ff4d8d] font-semibold text-sm flex items-center gap-1.5 transition py-1 px-2 rounded-lg hover:bg-[#ff2d78]/10 cursor-pointer"
              >
                <span>Chat öffnen</span>
                <span className="text-base font-normal">→</span>
              </button>

              {/* More options menu with Delete */}
              <div className="relative">
                <button
                  id={`btn-menu-contact-${contact.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuContactId(openMenuContactId === contact.id ? null : contact.id);
                  }}
                  title="Optionen (3 Punkte)"
                  className={`p-2 rounded-lg transition cursor-pointer ${
                    openMenuContactId === contact.id
                      ? 'bg-[#251320] text-[#ff2d78] border border-[#ff2d78]/40'
                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {openMenuContactId === contact.id && (
                  <div
                    className="absolute right-0 top-full mt-1.5 w-44 bg-[#151820] border border-zinc-700 rounded-xl shadow-2xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      id={`btn-dropdown-delete-${contact.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuContactId(null);
                        onDeleteContact(contact.id);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 flex items-center gap-2 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Person löschen</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuContactId(null);
                        onOpenChat(contact);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-medium text-zinc-300 hover:bg-zinc-800/80 hover:text-white flex items-center gap-2 transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#ff2d78] shrink-0" />
                      <span>Chat öffnen</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {contacts.length === 0 && (
          <div className="text-center py-12 px-4 bg-[#16181e] rounded-2xl border border-zinc-800 text-zinc-500">
            <p className="text-sm font-medium">Keine Kontakte gefunden.</p>
            <p className="text-xs text-zinc-600 mt-1">
              Nutze die Suchleiste oben, um deinen Partner zu finden.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
