// utils/auth.js
import Cookies from 'js-cookie';

export const getToken = () => {
  return Cookies.get('authToken');
};

export const setToken = (token: string) => {
  Cookies.set('authToken', token, { expires: 7, secure: true, sameSite: 'strict' });
};

export const removeToken = () => {
  Cookies.remove('authToken');
};
