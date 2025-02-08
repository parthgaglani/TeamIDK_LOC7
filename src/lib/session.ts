import Cookies from 'js-cookie';

export const setSessionCookie = (token: string) => {
  // Set session cookie with JWT token
  Cookies.set('session', token, {
    expires: 7, // Cookie expires in 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

export const getSessionCookie = () => {
  return Cookies.get('session');
};

export const removeSessionCookie = () => {
  Cookies.remove('session');
}; 