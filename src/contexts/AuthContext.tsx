import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Credentials } from '../types';
import api from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: Credentials) => Promise<boolean>;
  register: (userData: Credentials) => Promise<boolean>;
  logout: () => void;
  addAccount: (name: string, type: string, initialBalance: number) => Promise<void>;
  removeAccount: (accountId: string) => Promise<void>;
  updateAccountName: (accountId: string, newName: string) => Promise<void>;
  updateAccountBalance: (accountId: string, amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialAuthenticated = api.auth.isAuthenticated();
  const initialUser = initialAuthenticated ? { username: api.auth.getCurrentUser() || '', id: 0, accounts: [] } : null;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuthenticated);
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    // This useEffect is now empty as state is initialized directly.
    // It can be removed if no other side effects are needed.
    // Keeping it for now in case future logic requires it.
  }, []);

  const login = async (credentials: Credentials): Promise<boolean> => {
    try {
      const loggedInUser = await api.auth.login(credentials);
      setUser(loggedInUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (userData: Credentials): Promise<boolean> => {
    try {
      const registeredUser = await api.auth.register(userData);
      setUser(registeredUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    api.auth.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const addAccount = async (name: string, type: string, initialBalance: number): Promise<void> => {
    if (!user) return;
    try {
      const newAccount = await api.accounts.addAccount({ name, type, initialBalance });
      setUser(prevUser => prevUser ? { ...prevUser, accounts: [...prevUser.accounts, newAccount] } : null);
    } catch (error) {
      console.error('Failed to add account:', error);
    }
  };

  const removeAccount = async (accountId: string): Promise<void> => {
    if (!user) return;
    try {
      await api.accounts.deleteAccount(accountId);
      setUser(prevUser => prevUser ? { ...prevUser, accounts: prevUser.accounts.filter(acc => acc.id !== accountId) } : null);
    } catch (error) {
      console.error('Failed to remove account:', error);
    }
  };

  const updateAccountName = async (accountId: string, newName: string): Promise<void> => {
    if (!user) return;
    try {
      const updatedAccount = await api.accounts.updateAccountName(accountId, newName);
      setUser(prevUser => prevUser ? {
        ...prevUser,
        accounts: prevUser.accounts.map(acc => acc.id === accountId ? updatedAccount : acc)
      } : null);
    } catch (error) {
      console.error('Failed to update account name:', error);
    }
  };

  const updateAccountBalance = async (accountId: string, amount: number): Promise<void> => {
    if (!user) return;
    try {
      const updatedAccount = await api.accounts.updateAccountBalance(accountId, amount);
      setUser(prevUser => prevUser ? {
        ...prevUser,
        accounts: prevUser.accounts.map(acc => acc.id === accountId ? updatedAccount : acc)
      } : null);
    } catch (error) {
      console.error('Failed to update account balance:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      register,
      logout,
      addAccount,
      removeAccount,
      updateAccountName,
      updateAccountBalance
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
