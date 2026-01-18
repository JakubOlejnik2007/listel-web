export type MailboxType = 'POP3' | 'IMAP' | 'GMAIL';

export interface Mailbox {
  id: string;
  email: string;
  type: MailboxType;
  host?: string;
  port?: number;
  password?: string;
  // Gmail specific
  accessToken?: string;
  refreshToken?: string;
}

const STORAGE_KEY = 'listel_mailboxes';
const ACTIVE_MAILBOX_KEY = 'listel_active_mailbox';
const ENCRYPTION_KEY = 'listel_enc_key_v1'; // Simple obfuscation key

// Simple XOR encryption for basic obfuscation (NOT cryptographically secure, but better than plain text)
const encrypt = (text: string): string => {
  const key = ENCRYPTION_KEY;
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result); // Base64 encode
};

const decrypt = (encrypted: string): string => {
  const key = ENCRYPTION_KEY;
  const text = atob(encrypted); // Base64 decode
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
};

// Get all mailboxes
export const getMailboxes = (): Mailbox[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const encrypted = JSON.parse(stored);
    const decrypted = decrypt(encrypted);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error reading mailboxes:', error);
    return [];
  }
};

// Save all mailboxes
export const saveMailboxes = (mailboxes: Mailbox[]): void => {
  try {
    const json = JSON.stringify(mailboxes);
    const encrypted = encrypt(json);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(encrypted));
  } catch (error) {
    console.error('Error saving mailboxes:', error);
  }
};

// Add a new mailbox
export const addMailbox = (mailbox: Omit<Mailbox, 'id'>): Mailbox => {
  const mailboxes = getMailboxes();
  const newMailbox: Mailbox = {
    ...mailbox,
    id: `mailbox_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
  
  mailboxes.push(newMailbox);
  saveMailboxes(mailboxes);
  
  // If this is the first mailbox, set it as active
  if (mailboxes.length === 1) {
    setActiveMailbox(newMailbox.id);
  }
  
  return newMailbox;
};

// Remove a mailbox
export const removeMailbox = (id: string): void => {
  const mailboxes = getMailboxes();
  const filtered = mailboxes.filter(m => m.id !== id);
  saveMailboxes(filtered);
  
  // If we removed the active mailbox, set another one as active
  const activeId = getActiveMailboxId();
  if (activeId === id && filtered.length > 0) {
    setActiveMailbox(filtered[0].id);
  } else if (filtered.length === 0) {
    localStorage.removeItem(ACTIVE_MAILBOX_KEY);
  }
};

// Get active mailbox ID
export const getActiveMailboxId = (): string | null => {
  return localStorage.getItem(ACTIVE_MAILBOX_KEY);
};

// Set active mailbox
export const setActiveMailbox = (id: string): void => {
  localStorage.setItem(ACTIVE_MAILBOX_KEY, id);
};

// Get active mailbox
export const getActiveMailbox = (): Mailbox | null => {
  const id = getActiveMailboxId();
  if (!id) return null;
  
  const mailboxes = getMailboxes();
  return mailboxes.find(m => m.id === id) || null;
};

// Update a mailbox
export const updateMailbox = (id: string, updates: Partial<Mailbox>): void => {
  const mailboxes = getMailboxes();
  const index = mailboxes.findIndex(m => m.id === id);
  
  if (index !== -1) {
    mailboxes[index] = { ...mailboxes[index], ...updates };
    saveMailboxes(mailboxes);
  }
};