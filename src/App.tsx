/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MyNameCard } from './components/MyNameCard';
import { SearchBar } from './components/SearchBar';
import { PromoBanner } from './components/PromoBanner';
import { ContactList } from './components/ContactList';
import { BottomNav } from './components/BottomNav';
import { ChatView } from './components/ChatView';
import { SecurityTab } from './components/SecurityTab';
import { LifetimeTab } from './components/LifetimeTab';
import { KontoTab } from './components/KontoTab';
import { SettingsModal } from './components/SettingsModal';
import { StripeModal } from './components/StripeModal';
import { AuthScreen } from './components/AuthScreen';
import { OfflineNotificationModal } from './components/OfflineNotificationModal';
import { User, ChatMessage, ActiveTab } from './types';
import { INITIAL_USERS, INITIAL_MESSAGES } from './data/mockUsers';

// Helper to filter out any old demo users from previous storage
const isDemoUser = (user: User) => {
  const name = (user.username || '').toLowerCase();
  const id = (user.id || '').toLowerCase();
  return (
    name === 'paul' ||
    name === 'dominik' ||
    name === 'reh' ||
    name === 'sarah_m' ||
    name === 'crypto_alex' ||
    name === 'marcus_v' ||
    name === 'elena_k' ||
    name === 'dominik112' ||
    id.startsWith('user_paul') ||
    id.startsWith('user_reh') ||
    id.startsWith('user_sarah_m') ||
    id.startsWith('user_crypto_alex') ||
    id.startsWith('user_marcus_v') ||
    id.startsWith('user_elena_k') ||
    id === 'user_dominik'
  );
};

export default function App() {
  // Login & Current user state
  const [currentUsername, setCurrentUsername] = useState<string>(() => {
    const saved = localStorage.getItem('reblix_current_username');
    if (saved && saved !== 'dominik112' && saved !== 'paul' && saved !== 'reh') {
      return saved;
    }
    return '';
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const savedName = localStorage.getItem('reblix_current_username');
    const savedLogin = localStorage.getItem('reblix_is_logged_in');
    if (
      savedLogin === 'true' &&
      savedName &&
      savedName !== 'dominik112' &&
      savedName !== 'paul' &&
      savedName !== 'reh'
    ) {
      return true;
    }
    return false;
  });

  // Registered users state - strictly empty of any demo users
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('reblix_registered_users');
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        return parsed.filter((u) => !isDemoUser(u));
      } catch {
        return [];
      }
    }
    return [];
  });

  // Messages dictionary: keyed by userId
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('reblix_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  });

  // Search & Navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('chats');
  const [activeChatUser, setActiveChatUser] = useState<User | null>(null);

  // App metrics & billing state
  const [testMessagesCount, setTestMessagesCount] = useState<number>(() => {
    const defaultUser = 'dominik112';
    const savedUserMsg = localStorage.getItem(`reblix_test_messages_${defaultUser}`);
    if (savedUserMsg !== null) return Number(savedUserMsg);
    const saved = localStorage.getItem('reblix_test_messages');
    return saved !== null ? Number(saved) : 5;
  });

  // Only accounts that explicitly entered the master key (1304) have it active!
  const [unlockedAccounts, setUnlockedAccounts] = useState<string[]>(() => {
    localStorage.removeItem('reblix_master_key_unlocked');
    localStorage.removeItem('reblix_lifetime_unlocked');
    try {
      const saved = localStorage.getItem('reblix_unlocked_accounts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Accounts that have completed a verified 20 € payment via Stripe
  const [paidAccounts, setPaidAccounts] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('reblix_paid_accounts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Transient flag if someone enters master key in AuthScreen before choosing/registering a username
  const [pendingMasterKeyUnlock, setPendingMasterKeyUnlock] = useState<boolean>(false);

  // Master-Key is strictly active ONLY for accounts that explicitly entered it
  const isMasterKeyActive = Boolean(
    currentUsername && unlockedAccounts.includes(currentUsername.trim().toLowerCase())
  );
  
  // Paid status is strictly active ONLY for accounts with completed payment
  const isAccountPaid = Boolean(
    currentUsername && paidAccounts.includes(currentUsername.trim().toLowerCase())
  );

  // Lifetime is unlocked if either master-key is active or 20€ payment is completed
  const isLifetimeUnlocked = isMasterKeyActive || isAccountPaid;

  const freeChatsRemaining = isLifetimeUnlocked ? 9999 : 4;
  const totalFreeChats = 5;
  const usedChats = isLifetimeUnlocked ? 0 : 1;

  // Modals, simulation & notifications
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);

  // Check for incoming offline messages addressed to current user
  const getOfflineMessagesForUser = (uname: string) => {
    const unreadFromUsers: { user: User; messages: ChatMessage[] }[] = [];
    const normalizedUname = uname.toLowerCase();

    // Check all messages where receiver is this user or 'me'
    Object.entries(messagesMap).forEach(([chatPartnerId, msgs]: [string, ChatMessage[]]) => {
      const partner = registeredUsers.find((u) => u.id === chatPartnerId);
      if (!partner) return;

      const unread = (msgs || []).filter(
        (m: ChatMessage) =>
          !m.isSentByMe &&
          m.status !== 'read' &&
          (m.receiverName?.toLowerCase() === normalizedUname || (!m.receiverName && uname === currentUsername))
      );

      if (unread.length > 0) {
        unreadFromUsers.push({ user: partner, messages: unread });
      }
    });

    return unreadFromUsers;
  };

  const offlineMessagesForCurrent = getOfflineMessagesForUser(currentUsername);

  // Unread message count per partner ID for the contacts list
  const unreadCountsMap: Record<string, number> = {};
  registeredUsers.forEach((user) => {
    const msgs = messagesMap[user.id] || [];
    const count = msgs.filter((m) => !m.isSentByMe && m.status !== 'read').length;
    if (count > 0) {
      unreadCountsMap[user.id] = count;
    }
  });

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('reblix_is_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('reblix_current_username', currentUsername);
  }, [currentUsername]);

  useEffect(() => {
    localStorage.setItem('reblix_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('reblix_chat_messages', JSON.stringify(messagesMap));
  }, [messagesMap]);

  useEffect(() => {
    localStorage.setItem('reblix_test_messages', String(testMessagesCount));
  }, [testMessagesCount]);

  useEffect(() => {
    localStorage.setItem('reblix_unlocked_accounts', JSON.stringify(unlockedAccounts));
  }, [unlockedAccounts]);

  useEffect(() => {
    localStorage.setItem('reblix_paid_accounts', JSON.stringify(paidAccounts));
  }, [paidAccounts]);

  // App link share handler for Dashboard and Settings
  const handleShareApp = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'REBLIX Secure Chat',
          text: `Sicherer E2E-Verschlüsselter Chat ohne Handynummer. Verbinde dich mit mir ("${currentUsername}"):`,
          url: shareUrl,
        });
        showToast('App-Link geteilt!');
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('App-Link in Zwischenablage kopiert! Weitergeben an Partner.');
    } catch {
      showToast(`App-Link: ${shareUrl}`);
    }
  };

  // Payment completed handler - strictly activates lifetime for this account only after completed payment
  const handlePaymentSuccess = () => {
    if (currentUsername) {
      const clean = currentUsername.trim().toLowerCase();
      setPaidAccounts((prev) => {
        if (prev.includes(clean)) return prev;
        return [...prev, clean];
      });
      showToast(`Zahlung in Höhe von 20,00 € bestätigt! REBLIX Lifetime für "${currentUsername}" freigeschaltet.`);
    }
  };

  // Multi-tab real-time sync with BroadcastChannel
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;

    const channel = new BroadcastChannel('reblix_secure_channel');
    channel.onmessage = (event) => {
      const data = event.data;
      if (data?.type === 'NEW_MESSAGE') {
        const { senderName, receiverName, senderId, message } = data;
        // If this tab is the intended recipient of the message
        if (
          currentUsername &&
          receiverName &&
          receiverName.toLowerCase() === currentUsername.toLowerCase()
        ) {
          const partnerKey = senderId || `user_${senderName.toLowerCase()}`;

          // Ensure sender is in our registeredUsers list so they appear on our dashboard
          setRegisteredUsers((prev) => {
            if (prev.some((u) => u.username.toLowerCase() === senderName.toLowerCase())) {
              return prev;
            }
            const newPartner: User = {
              id: partnerKey,
              username: senderName,
              displayName: senderName,
              isOnline: true,
              lastSeen: 'Gerade aktiv',
              avatarLetter: senderName.charAt(0).toUpperCase(),
              description: 'Sicherer Chat-Partner',
            };
            return [newPartner, ...prev];
          });

          setMessagesMap((prev) => ({
            ...prev,
            [partnerKey]: [...(prev[partnerKey] || []), message],
          }));

          showToast(`Neue verschlüsselte Nachricht von "${senderName}" empfangen!`);
        }
      } else if (data?.type === 'USER_ADDED') {
        setRegisteredUsers((prev) => {
          if (prev.some((u) => u.username.toLowerCase() === data.user.username.toLowerCase())) {
            return prev;
          }
          return [...prev, data.user];
        });
      }
    };

    return () => {
      channel.close();
    };
  }, [currentUsername]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Master Key 1304 Unlock Handler - activates ONLY for the user who enters it
  const handleUnlockWithMasterKey = (key: string): boolean => {
    if (key.trim() === '1304') {
      if (currentUsername) {
        setUnlockedAccounts((prev) => {
          const lower = currentUsername.trim().toLowerCase();
          if (prev.includes(lower)) return prev;
          return [...prev, lower];
        });
        showToast('Master-Key 1304 aktiviert! Vollversion ist für dein Konto freigeschaltet.');
      } else {
        setPendingMasterKeyUnlock(true);
        showToast('Master-Key 1304 akzeptiert! Wird für deine Anmeldung/Registrierung aktiviert.');
      }
      return true;
    }
    return false;
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveChatUser(null);
    setPendingMasterKeyUnlock(false);
    showToast('Erfolgreich abgemeldet.');
  };

  // Self-Registration handler
  const handleRegisterUser = (newUser: User) => {
    setRegisteredUsers((prev) => [newUser, ...prev]);
    setCurrentUsername(newUser.username);
    setIsLoggedIn(true);
    setActiveChatUser(null);
    setActiveTab('chats');

    if (pendingMasterKeyUnlock) {
      setUnlockedAccounts((prev) => {
        const lower = newUser.username.trim().toLowerCase();
        if (prev.includes(lower)) return prev;
        return [...prev, lower];
      });
      setPendingMasterKeyUnlock(false);
      showToast(`Willkommen, ${newUser.username}! Master-Key für dieses Konto aktiviert.`);
    } else {
      showToast(`Willkommen, ${newUser.username}! Dein sicheres Konto ist aktiv.`);
    }

    try {
      const bc = new BroadcastChannel('reblix_secure_channel');
      bc.postMessage({ type: 'USER_ADDED', user: newUser });
      bc.close();
    } catch {}
  };

  // Login handler with offline messages check & notification
  const handleLoginUser = (uname: string) => {
    setCurrentUsername(uname);
    setIsLoggedIn(true);
    setActiveChatUser(null);
    setActiveTab('chats');

    // Load account-specific test messages count
    const savedCount = localStorage.getItem(`reblix_test_messages_${uname.toLowerCase()}`);
    setTestMessagesCount(savedCount !== null ? Number(savedCount) : 5);

    if (pendingMasterKeyUnlock) {
      setUnlockedAccounts((prev) => {
        const lower = uname.trim().toLowerCase();
        if (prev.includes(lower)) return prev;
        return [...prev, lower];
      });
      setPendingMasterKeyUnlock(false);
      showToast(`Willkommen, ${uname}! Master-Key für dieses Konto aktiviert.`);
    } else {
      const pending = getOfflineMessagesForUser(uname);
      if (pending.length > 0) {
        setIsOfflineModalOpen(true);
        const totalCount = pending.reduce((acc, curr) => acc + curr.messages.length, 0);
        showToast(`Du hast ${totalCount} ungelesene Nachricht(en) erhalten!`);
      } else {
        showToast(`Erfolgreich als "${uname}" angemeldet!`);
      }
    }
  };

  // Account switch handler with offline messages check & notification
  const handleSwitchUser = (uname: string) => {
    setCurrentUsername(uname);
    setIsLoggedIn(true);
    setActiveChatUser(null);

    // Load account-specific test messages count
    const savedCount = localStorage.getItem(`reblix_test_messages_${uname.toLowerCase()}`);
    setTestMessagesCount(savedCount !== null ? Number(savedCount) : 5);

    const pending = getOfflineMessagesForUser(uname);
    if (pending.length > 0) {
      setIsOfflineModalOpen(true);
      const totalCount = pending.reduce((acc, curr) => acc + curr.messages.length, 0);
      showToast(`Konto zu "${uname}" gewechselt: ${totalCount} neue Nachricht(en)!`);
    } else {
      showToast(`Konto zu "${uname}" gewechselt!`);
    }
  };

  // Security button handler (Works from everywhere including open chats!)
  const handleOpenSecurity = () => {
    // If leaving an open chat, trigger message self-destruction
    if (activeChatUser) {
      handleLeaveChat(activeChatUser.id);
    }
    setActiveTab('security');
  };

  // Leave active chat and self-destruct / clear messages as requested: "wenn er den chat verlässt wird die nachricht gelöscht"
  const handleLeaveChat = (partnerId?: string) => {
    const targetId = partnerId || (activeChatUser ? activeChatUser.id : null);
    if (targetId) {
      setMessagesMap((prev) => {
        const next = { ...prev };
        delete next[targetId];
        return next;
      });
      showToast('Chat verlassen: Verlauf zum Schutz der Privatsphäre gelöscht.');
    }
    setActiveChatUser(null);
  };

  // Add a new partner from the search bar or modal
  const handleAddNewPartner = (username: string) => {
    const cleanName = username.trim().toLowerCase();
    if (!cleanName) return;

    const existing = registeredUsers.find((u) => u.username.toLowerCase() === cleanName);
    if (existing) {
      setActiveChatUser(existing);
      setActiveTab('chats');
      showToast(`Partner "${existing.username}" gefunden und Chat geöffnet!`);
      return;
    }

    const newUser: User = {
      id: `user_${cleanName}_${Date.now()}`,
      username: cleanName,
      displayName: cleanName,
      isOnline: true,
      lastSeen: 'Gerade angemeldet',
      avatarLetter: cleanName.charAt(0).toUpperCase(),
      description: 'Neu angemeldeter Partner • Sichere Verbindung aktiv',
    };

    setRegisteredUsers((prev) => [newUser, ...prev]);
    setActiveChatUser(newUser);
    setActiveTab('chats');
    setSearchQuery('');
    showToast(`Partner "${cleanName}" im Netzwerk registriert & verbunden!`);

    try {
      const bc = new BroadcastChannel('reblix_secure_channel');
      bc.postMessage({ type: 'USER_ADDED', user: newUser });
      bc.close();
    } catch {}
  };

  // Delete a contact from the dashboard
  const handleDeleteContact = (userId: string) => {
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== userId));
    // Clear chat messages for this contact from storage as well
    setMessagesMap((prev) => {
      const next = { ...prev };
      delete next[userId];
      return next;
    });
    if (activeChatUser && activeChatUser.id === userId) {
      setActiveChatUser(null);
    }
    showToast('Person aus dem Dashboard gelöscht.');
  };

  // Send message handler (No computer replies! "es schreibt nicht irgend ein computer zurück, sondern die person selbst")
  const handleSendMessage = (
    text: string,
    attachment?: ChatMessage['attachment'],
    expiresInSec?: number
  ) => {
    if (!activeChatUser) return;

    // Check test message limit and decrement per message if not lifetime unlocked
    if (!isLifetimeUnlocked) {
      if (testMessagesCount <= 0) {
        showToast('Keine Testnachrichten mehr übrig (0/5)! Bitte schalte die Vollversion frei.');
        setIsStripeModalOpen(true);
        return;
      }

      const newCount = Math.max(0, testMessagesCount - 1);
      setTestMessagesCount(newCount);
      localStorage.setItem(`reblix_test_messages_${currentUsername.toLowerCase()}`, String(newCount));
      localStorage.setItem('reblix_test_messages', String(newCount));

      if (newCount > 0) {
        showToast(`Nachricht gesendet! Noch ${newCount} Testnachricht(en) übrig.`);
      } else {
        showToast('Letzte Testnachricht verbraucht (0/5)! Bitte schalte die Vollversion frei.');
      }
    }

    const partnerId = activeChatUser.id;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const myProfile = registeredUsers.find(
      (u) => u.username.toLowerCase() === currentUsername.toLowerCase()
    );
    const myId = myProfile ? myProfile.id : `user_${currentUsername.toLowerCase()}`;

    const newMsgForMe: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: 'me',
      receiverId: partnerId,
      senderName: currentUsername,
      receiverName: activeChatUser.username,
      text,
      timestamp: timeStr,
      isSentByMe: true,
      status: 'sent',
      expiresInSec,
      attachment,
    };

    const newMsgForPartner: ChatMessage = {
      ...newMsgForMe,
      senderId: myId,
      receiverId: 'me',
      isSentByMe: false,
      status: 'sent',
    };

    // Store in my chat thread with partner, and symmetrically in partner's thread with me
    setMessagesMap((prev) => {
      const partnerMsgs = prev[partnerId] || [];
      const myMsgs = prev[myId] || [];
      return {
        ...prev,
        [partnerId]: [...partnerMsgs, newMsgForMe],
        [myId]: [...myMsgs, newMsgForPartner],
      };
    });

    try {
      const bc = new BroadcastChannel('reblix_secure_channel');
      bc.postMessage({
        type: 'NEW_MESSAGE',
        senderName: currentUsername,
        receiverName: activeChatUser.username,
        senderId: myId,
        partnerId,
        message: newMsgForPartner,
      });
      bc.close();
    } catch {}
  };

  // Filter contacts by search query & exclude the currently active logged-in user from available chat targets
  const filteredContacts = registeredUsers
    .filter((u) => u.username.toLowerCase() !== currentUsername.toLowerCase())
    .filter((u) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return u.username.toLowerCase().includes(q) || (u.description && u.description.toLowerCase().includes(q));
    });

  const activeChatMessages = activeChatUser ? messagesMap[activeChatUser.id] || [] : [];

  // If user is logged out, show the Auth & Self-Registration screen!
  if (!isLoggedIn) {
    return (
      <AuthScreen
        registeredUsers={registeredUsers}
        onLogin={handleLoginUser}
        onRegister={handleRegisterUser}
        onUnlockWithMasterKey={handleUnlockWithMasterKey}
        isMasterKeyActive={isMasterKeyActive}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0d11] text-zinc-200 flex flex-col selection:bg-[#ff2d78] selection:text-white">
      {/* Top Header with working security button (left & right), account switcher & logout */}
      <Header
        currentUsername={currentUsername}
        testMessagesCount={testMessagesCount}
        onOpenSecurity={handleOpenSecurity}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAccountSwitch={() => {
          setActiveChatUser(null);
          setActiveTab('account');
        }}
        onLogout={handleLogout}
        isMasterKeyActive={isMasterKeyActive}
        isLifetimeUnlocked={isLifetimeUnlocked}
        onShareApp={handleShareApp}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 sm:px-6">
        {/* If chat is currently open, show Secure Messenger View */}
        {activeChatUser ? (
          <ChatView
            currentUsername={currentUsername}
            partner={activeChatUser}
            messages={activeChatMessages}
            onSendMessage={handleSendMessage}
            onBack={() => handleLeaveChat(activeChatUser.id)}
            onClearChat={() => {
              if (activeChatUser) {
                setMessagesMap((prev) => ({ ...prev, [activeChatUser.id]: [] }));
                showToast('Chat-Verlauf gelöscht.');
              }
            }}
            testMessagesCount={testMessagesCount}
            isLifetimeUnlocked={isLifetimeUnlocked}
            onOpenUnlockModal={() => setIsStripeModalOpen(true)}
          />
        ) : (
          /* Tab contents */
          <div>
            {activeTab === 'chats' && (
              <div className="space-y-4 pb-20 animate-in fade-in duration-150">
                {/* 1. Dein Name für deinen Partner */}
                <MyNameCard
                  username={currentUsername}
                  onEditUsername={() => setActiveTab('account')}
                  onShareApp={handleShareApp}
                />

                {/* 2. Suchleiste: Partner nach Benutzernamen suchen & finden */}
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  registeredUsers={registeredUsers.filter(
                    (u) => u.username.toLowerCase() !== currentUsername.toLowerCase()
                  )}
                  onSelectUserToChat={(user) => setActiveChatUser(user)}
                  onAddNewPartner={handleAddNewPartner}
                />

                {/* 3. Promo Banner mit Master Key 1304 Option */}
                <PromoBanner
                  freeChatsRemaining={freeChatsRemaining}
                  totalFreeChats={totalFreeChats}
                  usedChats={usedChats}
                  isUnlocked={isLifetimeUnlocked}
                  isMasterKeyActive={isMasterKeyActive}
                  onUnlockLifetime={() => setIsStripeModalOpen(true)}
                  onUnlockWithMasterKey={handleUnlockWithMasterKey}
                />

                {/* 4. ((•)) VERFÜGBARE KONTAKTE */}
                <ContactList
                  contacts={filteredContacts}
                  unreadCounts={unreadCountsMap}
                  onOpenChat={(user) => {
                    // Mark messages from this user as read when opening the chat
                    setMessagesMap((prev) => {
                      const userMsgs = prev[user.id] || [];
                      const updated = userMsgs.map((m) =>
                        !m.isSentByMe ? { ...m, status: 'read' as const } : m
                      );
                      return { ...prev, [user.id]: updated };
                    });
                    setActiveChatUser(user);
                  }}
                  onDeleteContact={handleDeleteContact}
                  onRefreshContacts={() => {
                    showToast('Kontakte aktualisiert.');
                  }}
                />
              </div>
            )}

            {activeTab === 'security' && (
              <SecurityTab currentUsername={currentUsername} />
            )}

            {activeTab === 'lifetime' && (
              <LifetimeTab
                freeChatsRemaining={freeChatsRemaining}
                totalFreeChats={totalFreeChats}
                isUnlocked={isLifetimeUnlocked}
                isMasterKeyActive={isMasterKeyActive}
                onOpenCheckout={() => setIsStripeModalOpen(true)}
                onUnlockWithMasterKey={handleUnlockWithMasterKey}
              />
            )}

            {activeTab === 'account' && (
              <KontoTab
                currentUsername={currentUsername}
                onChangeUsername={(name) => {
                  setCurrentUsername(name);
                  showToast(`Benutzername auf "${name}" geändert!`);
                }}
                registeredUsers={registeredUsers}
                onSwitchUser={handleSwitchUser}
                onAddNewPartner={handleAddNewPartner}
                onLogout={handleLogout}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating Toast notification */}
      {toastMessage && (
        <div
          id="reblix-toast"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#22131d] border border-[#ff2d78] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce"
        >
          <span className="w-2 h-2 rounded-full bg-[#ff2d78]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActiveChatUser(null);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onShareApp={handleShareApp}
        onResetAllData={() => {
          localStorage.clear();
          setRegisteredUsers(INITIAL_USERS);
          setMessagesMap(INITIAL_MESSAGES);
          setCurrentUsername('dominik112');
          setTestMessagesCount(5);
          setUnlockedAccounts([]);
          setPaidAccounts([]);
          showToast('Alle lokalen Daten & Einstellungen zurückgesetzt.');
        }}
      />

      {/* Stripe Checkout Modal with Master Key option */}
      <StripeModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        onUnlockWithMasterKey={handleUnlockWithMasterKey}
      />
      {/* Offline Message Notification Modal upon Login/Account Switch */}
      <OfflineNotificationModal
        isOpen={isOfflineModalOpen}
        currentUsername={currentUsername}
        offlineSenders={offlineMessagesForCurrent}
        onOpenChat={(user) => {
          setIsOfflineModalOpen(false);
          // Mark messages as read
          setMessagesMap((prev) => {
            const userMsgs = prev[user.id] || [];
            const updated = userMsgs.map((m) =>
              !m.isSentByMe ? { ...m, status: 'read' as const } : m
            );
            return { ...prev, [user.id]: updated };
          });
          setActiveChatUser(user);
        }}
        onDismiss={() => setIsOfflineModalOpen(false)}
      />
    </div>
  );
}
