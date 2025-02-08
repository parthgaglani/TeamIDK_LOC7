import Cookies from 'js-cookie';
import { UserData } from './firebase';

export const setSessionCookie = (userData: UserData) => {
  // Set session cookie with user data
  Cookies.set('session', JSON.stringify({
    uid: userData.uid,
    email: userData.email,
    role: userData.role,
    displayName: userData.displayName
  }), {
    expires: 7, // Cookie expires in 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

export const getSessionCookie = () => {
  const session = Cookies.get('session');
  if (!session) return null;
  
  try {
    return JSON.parse(session);
  } catch {
    return null;
  }
};

export const removeSessionCookie = () => {
  Cookies.remove('session');
}; 