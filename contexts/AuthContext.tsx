
import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { User } from '../types';
import { Role } from '../types';
import { USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (pin: string, password?: string) => { success: boolean, requiresPassword?: boolean, error?: string };
  logout: () => void;
  allStaff: User[];
  updateStaff: (staff: User[]) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [staff, setStaff] = useState<User[]>(USERS);

  const login = useCallback((pin: string, password?: string) => {
    const foundUser = staff.find(u => u.pin === pin);
    
    if (!foundUser) {
      return { success: false, error: 'الرمز السري غير صحيح' };
    }

    if (foundUser.role === Role.ADMIN) {
      if (!password) return { success: false, requiresPassword: true };
      if (foundUser.password !== password) return { success: false, error: 'كلمة المرور غير صحيحة' };
    }

    setUser(foundUser);
    return { success: true };
  }, [staff]);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, logout, allStaff: staff, updateStaff: setStaff }}>
      {children}
    </AuthContext.Provider>
  );
};
