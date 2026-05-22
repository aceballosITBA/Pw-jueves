const AUTH_USER_KEY = 'auth_user';
const AUTH_SESSION_KEY = 'auth_session';
const AUTH_LAST_LOGIN_KEY = 'auth_last_login';

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

export function readAuthUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? safeParse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function isAuthed() {
  try {
    return !!localStorage.getItem(AUTH_SESSION_KEY);
  } catch (e) {
    return false;
  }
}

export function persistAuth(user) {
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_SESSION_KEY, '1');
    localStorage.setItem(AUTH_LAST_LOGIN_KEY, new Date().toISOString());
    window.dispatchEvent(new Event('auth:updated'));
  } catch (e) {
    // ignore
  }
  return user;
}

export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(AUTH_LAST_LOGIN_KEY);
    window.dispatchEvent(new Event('auth:updated'));
  } catch (e) {
    // ignore
  }
}
