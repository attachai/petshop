import { AppUser } from '../types';
import { clearPersistedAuth, clearStoredAuthUser, getStoredAuthUser, setStoredAuthUser } from './authSession';

type AuthListener = (user: AppUser | null) => void;

let currentUser: AppUser | null = getStoredAuthUser();
const listeners = new Set<AuthListener>();

function notify(user: AppUser | null) {
  currentUser = user;
  listeners.forEach((listener) => listener(user));
}

export function setAuthUser(user: AppUser | null): void {
  if (user) {
    setStoredAuthUser(user);
  } else {
    clearStoredAuthUser();
  }

  notify(user);
}

export function clearAuthState(): void {
  clearPersistedAuth();
  notify(null);
}

export const authStore = {
  get currentUser(): AppUser | null {
    return currentUser;
  },
  onAuthStateChanged(callback: AuthListener): () => void {
    listeners.add(callback);
    callback(currentUser);
    return () => {
      listeners.delete(callback);
    };
  },
};
