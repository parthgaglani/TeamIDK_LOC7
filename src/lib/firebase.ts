'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { setSessionCookie, removeSessionCookie } from './session';
import firebaseConfig from './firebase-config';

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

export type UserRole = 'employee' | 'manager' | 'finance' | 'admin';

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  createdAt: number;
}

const createUserDocument = async (user: User, role: UserRole = 'employee'): Promise<UserData> => {
  try {
    console.log('Creating/updating user document:', user.uid);
    
    // Create a base document with only the essential fields
    const docData = {
      email: user.email || '',
      role: role,
      createdAt: serverTimestamp()
    };

    // Only add displayName if it exists
    if (user.displayName) {
      Object.assign(docData, { displayName: user.displayName });
    }

    // Write to Firestore
    await setDoc(doc(db, 'users', user.uid), docData);
    console.log('User document created/updated successfully');

    // Return the user data in the expected format
    return {
      uid: user.uid,
      email: user.email || '',
      role: role,
      displayName: user.displayName || undefined,
      createdAt: Date.now() // Use current timestamp for immediate return
    };
  } catch (error) {
    console.error('Error creating/updating user document:', error);
    throw new Error('Failed to create user document');
  }
};

export const createUserWithRole = async (email: string, password: string): Promise<UserData> => {
  try {
    console.log('Creating user with email:', email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User created successfully:', userCredential.user.uid);
    
    const userData = await createUserDocument(userCredential.user);
    setSessionCookie(userData);
    return userData;
  } catch (error: any) {
    console.error('Create user error:', error);
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('Email already registered. Please sign in instead.');
        case 'auth/invalid-email':
          throw new Error('Invalid email address.');
        case 'auth/operation-not-allowed':
          throw new Error('Email/password accounts are not enabled. Please contact support.');
        case 'auth/weak-password':
          throw new Error('Password is too weak. Please use a stronger password.');
        default:
          throw new Error(error.message || 'Failed to create account');
      }
    }
    throw error;
  }
};

export const updateUserRole = async (uid: string, newRole: UserRole): Promise<UserData> => {
  try {
    console.log(`Updating role for user ${uid} to ${newRole}`);
    
    // Verify the role is valid
    if (!['employee', 'finance', 'manager'].includes(newRole)) {
      throw new Error('Invalid role specified');
    }

    // Get current user data
    const currentData = await getUserData(uid);
    if (!currentData) {
      throw new Error('User not found');
    }

    // Update the role in Firestore
    await setDoc(doc(db, 'users', uid), {
      ...currentData,
      role: newRole,
      updatedAt: serverTimestamp()
    }, { merge: true });

    // Get and return the updated user data
    const updatedData = await getUserData(uid);
    if (!updatedData) {
      throw new Error('Failed to retrieve updated user data');
    }

    return updatedData;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw new Error('Failed to update user role');
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('Signing in user:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in successfully:', userCredential.user.uid);
    
    // Get or create user data
    let userData = await getUserData(userCredential.user.uid);
    if (!userData) {
      console.log('Creating user data for existing auth user');
      userData = await createUserDocument(userCredential.user);
    }
    
    setSessionCookie(userData);
    return { userCredential, userData };
  } catch (error: any) {
    console.error('Sign in error:', error);
    if (error.code) {
      switch (error.code) {
        case 'auth/invalid-email':
          throw new Error('Invalid email address.');
        case 'auth/user-disabled':
          throw new Error('This account has been disabled. Please contact support.');
        case 'auth/user-not-found':
          throw new Error('No account found with this email.');
        case 'auth/wrong-password':
          throw new Error('Incorrect password.');
        default:
          throw new Error(error.message || 'Failed to sign in');
      }
    }
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    removeSessionCookie();
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    console.log('Fetching user data for:', uid);
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      console.log('No user document found for:', uid);
      return null;
    }
    
    const data = userDoc.data();
    const userData: UserData = {
      uid: userDoc.id,
      email: data.email || '',
      role: data.role as UserRole,
      displayName: data.displayName || undefined,
      createdAt: data.createdAt?.toMillis() || Date.now()
    };
    
    console.log('User data retrieved:', userData);
    return userData;
  } catch (error: any) {
    console.error('Get user data error:', error);
    throw error;
  }
};

export const getUserRole = async (uid: string): Promise<UserRole> => {
  try {
    const userData = await getUserData(uid);
    if (!userData) {
      console.log('No user data found, creating with default role');
      const authUser = auth.currentUser;
      if (!authUser) {
        console.log('No authenticated user found, defaulting to employee role');
        return 'employee';
      }
      const newUserData = await createUserDocument(authUser);
      return newUserData.role;
    }
    return userData.role;
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'employee'; // Default to employee role if there's an error
  }
};

export { auth, db }; 