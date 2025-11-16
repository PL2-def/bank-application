import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Account } from '../types';
import { Modal, Button, Form } from 'react-bootstrap';

const AccountsPage: React.FC = () => {
  const { user, addAccount, removeAccount, updateAccountName, updateAccountBalance } = useAuth();
  const accounts = user?.accounts || [];

  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState('Checking');
  const [newAccountInitialBalance, setNewAccountInitialBalance] = useState(0);

  const [showRenameAccountModal, setShowRenameAccountModal] = useState(false);
  const [accountToRename, setAccountToRename] = useState<Account | null>(null);
  const [renameAccountName, setRenameAccountName] = useState('');

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [accountForTransaction, setAccountForTransaction] = useState<Account | null>(null);
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw'>('deposit');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getAccountIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return 'bi-wallet2';
      case 'savings':
        return 'bi-piggy-bank';
      case 'investment':
        return 'bi-graph-up-arrow';
      default:
        return 'bi-credit-card';
    }
  };

  // --- Add Account Handlers ---
  const handleAddAccount = () => {
    setShowAddAccountModal(true);
  };

  const handleAddAccountSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (newAccountName && newAccountType) {
      addAccount(newAccountName, newAccountType, newAccountInitialBalance);
      setShowAddAccountModal(false);
      setNewAccountName('');
      setNewAccountType('Checking');
      setNewAccountInitialBalance(0);
    }
  };

  // --- Rename Account Handlers ---
  const handleRenameAccount = (account: Account) => {
    setAccountToRename(account);
    setRenameAccountName(account.name);
    setShowRenameAccountModal(true);
  };

  const handleRenameAccountSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (accountToRename && renameAccountName) {
      updateAccountName(accountToRename.id, renameAccountName);
      setShowRenameAccountModal(false);
      setAccountToRename(null);
      setRenameAccountName('');
    }
  };

  // --- Transaction Handlers (Deposit/Withdraw) ---
  const handleTransaction = (account: Account, type: 'deposit' | 'withdraw') => {
    setAccountForTransaction(account);
    setTransactionType(type);
    setTransactionAmount(0); // Reset amount
    setShowTransactionModal(true);
  };

  const handleTransactionSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (accountForTransaction && transactionAmount > 0) {
      const amount = transactionType === 'deposit' ? transactionAmount : -transactionAmount;
      updateAccountBalance(accountForTransaction.id, amount);
      setShowTransactionModal(false);
      setAccountForTransaction(null);
      setTransactionAmount(0);
    }
  };

  // --- Close Account Handler ---
  const handleCloseAccount = (accountId: string) => {
    if (window.confirm('Are you sure you want to close this account? This action cannot be undone.')) {
      removeAccount(accountId);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Your Accounts</h1>

      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={handleAddAccount}>
          <i className="bi bi-plus-circle me-2"></i>
          Open New Account
        </Button>
      </div>

      {accounts.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          You don't have any accounts yet. Click "Open New Account" to get started!
        </div>
      ) : (
        <div className="card">
          <ul className="list-group list-group-flush">
            {accounts.map(account => (
              <li key={account.id} className="list-group-item d-flex justify-content-between align-items-center flex-wrap py-3">
                <div className="d-flex align-items-center flex-grow-1">
                  <i className={`bi ${getAccountIcon(account.type)} fs-2 me-4 text-primary`}></i>
                  <div>
                    <h5 className="mb-1">{account.name} <small className="text-muted">({account.type})</small></h5>
                    <small className="text-muted">ID: {account.id}</small>
                  </div>
                </div>
                <div className="text-end">
                  <span className="fs-4 fw-bold d-block">{formatCurrency(account.balance)}</span>
                  <div className="mt-2">
                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleTransaction(account, 'deposit')}>Deposit</Button>
                    <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleTransaction(account, 'withdraw')}>Withdraw</Button>
                    <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleRenameAccount(account)}>Rename</Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleCloseAccount(account.id)}>Close</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add Account Modal */}
      <Modal show={showAddAccountModal} onHide={() => setShowAddAccountModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Open New Account</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddAccountSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Account Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., My Savings Account"
                value={newAccountName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAccountName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Account Type</Form.Label>
              <Form.Select
                value={newAccountType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewAccountType(e.target.value)}
              >
                <option value="Checking">Checking</option>
                <option value="Savings">Savings</option>
                <option value="Investment">Investment</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Initial Balance</Form.Label>
              <Form.Control
                type="number"
                placeholder="0.00"
                value={newAccountInitialBalance}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAccountInitialBalance(parseFloat(e.target.value) || 0)}
                min="0"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddAccountModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Open Account
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Rename Account Modal */}
      <Modal show={showRenameAccountModal} onHide={() => setShowRenameAccountModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rename Account</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleRenameAccountSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>New Account Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new name"
                value={renameAccountName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRenameAccountName(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRenameAccountModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Rename
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Transaction Modal (Deposit/Withdraw) */}
      <Modal show={showTransactionModal} onHide={() => setShowTransactionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{transactionType === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleTransactionSubmit}>
          <Modal.Body>
            <p>Account: <strong>{accountForTransaction?.name}</strong> ({accountForTransaction?.type})</p>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="0.00"
                value={transactionAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransactionAmount(parseFloat(e.target.value) || 0)}
                min="0.01"
                step="0.01"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTransactionModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {transactionType === 'deposit' ? 'Deposit' : 'Withdraw'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountsPage;
