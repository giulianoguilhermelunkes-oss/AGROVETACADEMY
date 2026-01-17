import { User, ChatMessage } from '../types';

const USERS_KEY = 'agrovet_users';
const CURRENT_USER_KEY = 'agrovet_current_user';
const MESSAGES_KEY = 'agrovet_messages';

// Simple listener system for local component updates (Observer Pattern)
// Kept to allow AuthScreen to react to user deletions/additions within the same session
type Listener = () => void;
const listeners: Set<Listener> = new Set();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Helper to generate random color based on role/spec
export const getUserColor = (role: 'student' | 'professor', spec?: string): string => {
  if (role === 'student') return 'bg-slate-500';
  if (spec === 'agronomia') return 'bg-emerald-600';
  if (spec === 'zootecnia') return 'bg-amber-600';
  if (spec === 'veterinaria') return 'bg-sky-600';
  return 'bg-slate-700';
};

export const storageService = {
  // Subscribe to local changes
  subscribe: (listener: Listener): () => void => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getUsers: (): User[] => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveUser: (user: User) => {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    notifyListeners();
  },

  updateUser: (updatedUser: User) => {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    
    // Update session if it's the current user
    const currentUser = storageService.getCurrentUser();
    if (currentUser && currentUser.id === updatedUser.id) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }

    notifyListeners();
  },

  deleteUser: (userId: string) => {
    const users = storageService.getUsers();
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
    
    const current = storageService.getCurrentUser();
    if (current && current.id === userId) {
      storageService.logout();
    }

    notifyListeners();
  },

  login: (email: string): User | null => {
    const users = storageService.getUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  getMessages: (): ChatMessage[] => {
    const stored = localStorage.getItem(MESSAGES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveMessage: (message: ChatMessage) => {
    const messages = storageService.getMessages();
    messages.push(message);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    notifyListeners();
  }
};