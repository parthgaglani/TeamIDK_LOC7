'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  AuthError 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { SignJWT } from 'jose';
import firebaseConfig from './firebase-config';

// User role type
export type UserRole = 'employee' | 'finance';

// User data interface
export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  department?: string;
  createdAt: number;
}

// Session management functions
export const setSessionCookie = (token: string) => {
  // Set session cookie with JWT token
  document.cookie = `session=${token}; path=/; max-age=${7 * 24 * 60 * 60}; ${process.env.NODE_ENV === 'production' ? 'secure; ' : ''}samesite=strict`;
};

export const removeSessionCookie = () => {
  document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const createUserDocument = async (user: User, role: UserRole = 'employee'): Promise<UserData> => {
  try {
    const docData = {
      email: user.email || '',
      role,
      createdAt: serverTimestamp(),
      ...(user.displayName && { displayName: user.displayName })
    };

    await setDoc(doc(db, 'users', user.uid), docData);

    return {
      uid: user.uid,
      email: user.email || '',
      role,
      displayName: user.displayName || undefined,
      createdAt: Date.now()
    };
  } catch (error) {
    console.error('Error creating user document:', error);
    throw new Error('Failed to create user document');
  }
};

const createJWT = async (userData: UserData) => {
  const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
  const token = await new SignJWT({ 
    uid: userData.uid,
    email: userData.email,
    role: userData.role,
    displayName: userData.displayName
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
  return token;
};

const authErrorMessages: Record<string, string> = {
  'auth/email-already-in-use': 'Email already registered. Please sign in instead.',
  'auth/invalid-email': 'Invalid email address.',
  'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
  'auth/weak-password': 'Password is too weak. Please use a stronger password.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password.',
};

export const createUserWithRole = async (email: string, password: string): Promise<UserData> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userData = await createUserDocument(userCredential.user);
    const token = await createJWT(userData);
    setSessionCookie(token);
    return userData;
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(authErrorMessages[authError.code] || authError.message || 'Failed to create account');
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    let userData = await getUserData(userCredential.user.uid);
    
    if (!userData) {
      userData = await createUserDocument(userCredential.user);
    }
    
    const token = await createJWT(userData);
    setSessionCookie(token);
    return { userData };
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(authErrorMessages[authError.code] || authError.message || 'Failed to sign in');
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    removeSessionCookie();
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) return null;
    
    const data = userDoc.data();
    return {
      uid: userDoc.id,
      email: data.email || '',
      role: data.role,
      displayName: data.displayName,
      createdAt: data.createdAt?.toMillis() || Date.now()
    };
  } catch (error) {
    console.error('Get user data error:', error);
    throw error;
  }
};

export { auth, db }; 