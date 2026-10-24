import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/user';
import { mockUsers } from '../data/mockUsers';
import { loadFromStorage, saveToStorage } from '../utils/storage';

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  updateUserProfile: (updated: Partial<User>) => void;
  allUsers: Record<string, User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return loadFromStorage<UserRole>('current_role', 'customer');
  });

  const [usersState, setUsersState] = useState<Record<string, User>>(() => {
    return loadFromStorage<Record<string, User>>('users_data', mockUsers);
  });

  useEffect(() => {
    saveToStorage('current_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    saveToStorage('users_data', usersState);
  }, [usersState]);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const updateUserProfile = (updated: Partial<User>) => {
    setUsersState((prev) => ({
      ...prev,
      [currentRole]: {
        ...prev[currentRole],
        ...updated
      }
    }));
  };

  const currentUser = usersState[currentRole] || mockUsers[currentRole];

  return (
    <AuthContext.Provider value={{
      currentUser,
      currentRole,
      switchRole,
      updateUserProfile,
      allUsers: usersState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
