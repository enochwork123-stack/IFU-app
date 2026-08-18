/**
 * Client-side End-to-End Encryption (E2EE) for User Answers
 * Uses AES-GCM 256-bit with PBKDF2 key derivation via Web Crypto API.
 * Plaintext answers are never sent to Supabase; only ciphertext + IV are stored remotely.
 */

const APP_SALT = new TextEncoder().encode('ifu-discipleship-e2ee-salt-v1');

/**
 * Convert ArrayBuffer to Base64 string
 */
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Convert Base64 string to Uint8Array
 */
function base64ToBuffer(base64: string): Uint8Array {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derive a 256-bit AES-GCM CryptoKey deterministically from the user's ID
 */
async function deriveUserKey(userId: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(userId),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: APP_SALT,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export interface EncryptedPayload {
  cipherText: string; // Base64 encoded ciphertext
  iv: string; // Base64 encoded 12-byte initialization vector
}

/**
 * Encrypt plaintext string for a specific user using AES-GCM
 */
export async function encryptAnswer(
  userId: string,
  plainText: string
): Promise<EncryptedPayload> {
  if (!window.crypto?.subtle) {
    throw new Error('Web Crypto API is not supported in this browser.');
  }

  const key = await deriveUserKey(userId);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedText = new TextEncoder().encode(plainText);

  const cipherBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encodedText
  );

  return {
    cipherText: bufferToBase64(cipherBuffer),
    iv: bufferToBase64(iv.buffer),
  };
}

/**
 * Decrypt ciphertext payload for a specific user using AES-GCM
 */
export async function decryptAnswer(
  userId: string,
  payload: EncryptedPayload
): Promise<string> {
  if (!window.crypto?.subtle) {
    throw new Error('Web Crypto API is not supported in this browser.');
  }

  const key = await deriveUserKey(userId);
  const iv = base64ToBuffer(payload.iv);
  const cipherBytes = base64ToBuffer(payload.cipherText);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    cipherBytes
  );

  return new TextDecoder().decode(decryptedBuffer);
}
