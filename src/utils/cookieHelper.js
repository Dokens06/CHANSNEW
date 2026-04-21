import Cookies from 'js-cookie';

export const setCookie = (name, value) => {
  Cookies.set(name, value, { secure: true, sameSite: 'Strict' });
};

// Get a cookie
export const getCookie = (name) => {
  return Cookies.get(name);
};

// Remove a cookie
export const removeCookie = (name) => {
  Cookies.remove(name);
};
