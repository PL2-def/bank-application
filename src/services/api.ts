import axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios';
import type { Account, Transaction, LoanProduct, User, Credentials } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the authorization token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken'); // Assuming we store a token (e.g., username)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

const auth = {
  login: async (credentials: Credentials): Promise<User> => {
    const response = await api.post('/api/login', credentials);
    const user: User = response.data;
    localStorage.setItem('authToken', user.username); // Store username as token for now
    return user;
  },
  register: async (userData: Credentials): Promise<User> => {
    const response = await api.post('/api/register', userData);
    const user: User = response.data;
    localStorage.setItem('authToken', user.username); // Store username as token for now
    return user;
  },
  logout: () => {
    localStorage.removeItem('authToken');
  },
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },
  getCurrentUser: (): string | null => {
    return localStorage.getItem('authToken');
  }
};

const accounts = {
  getAccounts: async (): Promise<Account[]> => {
    const response = await api.get('/api/accounts');
    return response.data;
  },
  addAccount: async (accountData: { name: string; type: string; initialBalance: number }): Promise<Account> => {
    const response = await api.post('/api/accounts', accountData);
    return response.data;
  },
  deleteAccount: async (accountId: string): Promise<void> => {
    await api.delete(`/api/accounts/${accountId}`);
  },
  updateAccountName: async (accountId: string, newName: string): Promise<Account> => {
    const response = await api.put(`/api/accounts/${accountId}/name`, { newName });
    return response.data;
  },
  updateAccountBalance: async (accountId: string, amount: number): Promise<Account> => {
    const response = await api.put(`/api/accounts/${accountId}/balance`, { amount });
    return response.data;
  },
};

const transactions = {
  getTransactions: async (): Promise<Transaction[]> => {
    // This endpoint is not yet implemented in the backend.
    // For now, it will return an empty array or throw an error if called.
    // You would typically fetch from an endpoint like '/api/transactions'
    console.warn('getTransactions is called, but the backend endpoint is not yet implemented.');
    return [];
  },
};

const loans = {
  getLoanProducts: async (): Promise<LoanProduct[]> => {
    // This endpoint is not yet implemented in the backend.
    // For now, it will return an empty array or throw an error if called.
    // You would typically fetch from an endpoint like '/api/loan-products'
    console.warn('getLoanProducts is called, but the backend endpoint is not yet implemented.');
    return [];
  },
};

export default {
  auth,
  accounts,
  transactions,
  loans,
};