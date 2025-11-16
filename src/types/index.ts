export interface Account {
  id: string; // Unique identifier for the account
  name: string; // Name of the account (e.g., "My Checking Account")
  type: string; // Type of account (e.g., "Checking", "Savings")
  balance: number; // Current balance of the account
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
}

export interface LoanProduct {
  id: string;
  name: string;
  interestRate: string;
  term: string;
  description: string;
}

export interface User {
  id: number;
  username: string;
  accounts: Account[];
}

export interface Credentials {
  username: string;
  password?: string; // Password is optional for some contexts, but required for login/register
}