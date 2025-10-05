
import React, { createContext, useState, useCallback } from 'react';
import type { User } from '../types';
import { Role } from '../types';
import { USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((username: string, password?: string): boolean => {
    const foundUser = USERS.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!foundUser) {
      return false;
    }

    // Admin requires a password
    if (foundUser.role === Role.ADMIN) {
      if (foundUser.password === password) {
        setUser(foundUser);
        return true;
      }
      return false;
    }

    // Waiters do not require a password
    if (foundUser.role === Role.WAITER) {
      setUser(foundUser);
      return true;
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
