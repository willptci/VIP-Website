// File: src/firebase/signUpSession.ts
import { db } from './firebaseConfig';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, writeBatch, } from 'firebase/firestore';
import { signUp } from '@/lib/actions/user.actions';
import { sendTextMessage } from '@/app/api/whatsapp/messages/textMessages';
// import { sendUrlButton } from '@/app/api/whatsapp/messages/ctaMessages';

const SESSIONS = 'sessions';
const BUSINESSES = 'businesses';
const SETTINGS = 'settings';
// const PLATFORM = 'https://9111-2601-c2-1680-6460-95ce-b2cb-de73-bda3.ngrok-free.app/';

export interface sessionType {
  phone: string,
  step: string,
  data: {},
  createdAt: typeof serverTimestamp,
  expiresAt: typeof serverTimestamp,   // human‐readable
  ttl: number, // Firestore TTL
}

// Retrieve a session for a user by phone number
export async function getSessionForUser(phone: string) {
  const ref = doc(db, SESSIONS, phone);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  // Session shape: { step, data, createdAt, ttl (expiry epoch sec), ... }
  const session = snap.data() as any & { ttl?: number };
  const nowSec = Math.floor(Date.now() / 1000);

  // Purge expired sessions using TTL field
  if (session.ttl && session.ttl < nowSec) {
    await deleteDoc(ref);
    return null;
  }

  return session;
}

// Merge writes so unchanged fields stay intact
export async function saveSession(phone: string, session: any) {
  const ref = doc(db, SESSIONS, phone);
  await setDoc(ref, session, { merge: true });
}

export async function clearSession(phone: string) {
  await deleteDoc(doc(db, SESSIONS, phone));
}

// Initialize a session with Firestore TTL
export async function initializeSession(phone: string, ttlMinutes = 30) {
    const expiresMs = Date.now() + ttlMinutes * 60 * 1000;
    const session = {
      phone,
      step: 'init',
      data: {},
      createdAt: serverTimestamp(),
      expiresAt: serverTimestamp(),   // human‐readable
      ttl: Math.floor(expiresMs / 1000), // Firestore TTL
    };
    await setDoc(doc(db, SESSIONS, phone), session);
    return session;
}