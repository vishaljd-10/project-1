import { EncryptedVaultItem } from '../types';

const VAULT_STORAGE_KEY = 'navratri_amd_vault_items';
const BIOMETRIC_STATE_KEY = 'navratri_amd_biometric_unlocked';

// Generates an AES-GCM key derived from a master passcode or biometric seed
async function getDerivedKey(passcode: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passcode),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('navratri-amd-salt-2026'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt string with AES-GCM
export async function encryptData(plainText: string, passcode: string = 'GarbaAhmedabad2026'): Promise<string> {
  try {
    const key = await getDerivedKey(passcode);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(plainText)
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch (err) {
    console.warn('Encryption fallback to base64 encoding:', err);
    return btoa(unescape(encodeURIComponent(plainText)));
  }
}

// Decrypt string with AES-GCM
export async function decryptData(cipherBase64: string, passcode: string = 'GarbaAhmedabad2026'): Promise<string> {
  try {
    const binary = atob(cipherBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const iv = bytes.slice(0, 12);
    const data = bytes.slice(12);
    const key = await getDerivedKey(passcode);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (err) {
    try {
      return decodeURIComponent(escape(atob(cipherBase64)));
    } catch {
      return cipherBase64;
    }
  }
}

export const INITIAL_VAULT_ITEMS: EncryptedVaultItem[] = [
  {
    id: 'vault-1',
    title: 'Aadhaar / Photo ID Verification Token',
    type: 'ID Proof',
    content: 'ID-AMD-9821-**** (Verified by Gujarat Garba Mahotsav Authority)',
    updatedAt: '2026-09-26 21:00',
  },
  {
    id: 'vault-2',
    title: 'Emergency Medical & Blood Group Info',
    type: 'Medical Note',
    content: 'Blood Group: B+ve | Emergency Contact: +91 98250 11223 (Family) | No allergies',
    updatedAt: '2026-09-26 21:15',
  },
  {
    id: 'vault-3',
    title: 'Ahmedabad Police SHE-Team Quick Pin',
    type: 'Emergency Contact',
    content: 'Trained Volunteer Guard Stationed at Karnavati Gate 2 - Officer Kavita Zala (SHE Unit 12)',
    updatedAt: '2026-09-26 21:30',
  },
];

export function getStoredVaultItems(): EncryptedVaultItem[] {
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) return INITIAL_VAULT_ITEMS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_VAULT_ITEMS;
  }
}

export function saveVaultItem(item: EncryptedVaultItem): void {
  const current = getStoredVaultItems();
  const index = current.findIndex((i) => i.id === item.id);
  if (index >= 0) {
    current[index] = item;
  } else {
    current.unshift(item);
  }
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(current));
}
