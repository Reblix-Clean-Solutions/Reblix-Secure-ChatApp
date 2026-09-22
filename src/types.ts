export interface User {
  id: string;
  username: string;
  displayName?: string;
  isOnline: boolean;
  lastSeen?: string;
  avatarLetter: string;
  description: string;
  isMainAccount?: boolean;
  fingerprint?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName?: string;
  receiverId: string;
  receiverName?: string;
  text: string;
  timestamp: string;
  isSentByMe: boolean;
  status: 'sent' | 'delivered' | 'read';
  expiresInSec?: number; // Self-destruct timer in seconds
  expiresAt?: number;
  attachment?: {
    type: 'image' | 'voice' | 'file';
    url?: string;
    name?: string;
    duration?: string;
  };
}

export type ActiveTab = 'chats' | 'security' | 'lifetime' | 'account';
